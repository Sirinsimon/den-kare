from ultralytics import YOLO
from fastapi import FastAPI, File, UploadFile
from starlette.responses import HTMLResponse
from PIL import Image
import uvicorn
import io
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # You can specify specific origins like ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods like POST, GET, etc.
    allow_headers=["*"],  # Allows all headers
)

@app.get("/", response_class=HTMLResponse)
async def root():
    """
    Site main page handler function.
    :return: Content of index.html file
    """
    with open("templates/index.html") as file:
        return file.read()

@app.post("/detect")
async def detect(image_file: UploadFile = File(...)):
    """
    Handler of /detect POST endpoint.
    Receives uploaded file with a name "image_file", passes it
    through YOLOv8 object detection network and returns an array
    of bounding boxes.
    :return: a JSON array of objects bounding boxes in format [[x1,y1,x2,y2,object_type,probability],..]
    """
    image_bytes = await image_file.read()
    buf = io.BytesIO(image_bytes)
    boxes = detect_objects_on_image(buf)
    return {"boxes": boxes}

def detect_objects_on_image(buf):
    """
    Function receives an image,
    passes it through YOLOv8 neural network
    and returns an array of detected objects
    and their bounding boxes
    :param buf: Input image file stream
    :return: Array of bounding boxes in format [[x1,y1,x2,y2,object_type,probability],..]
    """
    model = YOLO("best.pt")
    results = model.predict(Image.open(buf))
    result = results[0]
    output = []
    for box in result.boxes:
        x1, y1, x2, y2 = [round(x) for x in box.xyxy[0].tolist()]
        class_id = box.cls[0].item()
        prob = round(box.conf[0].item(), 2)
        prob_percentage = f"{prob * 100:.2f}%"
        output.append([x1, y1, x2, y2, result.names[class_id], prob_percentage])
    return output



#rag---------------------------------------------------------------------------------------------------
from fastapi import FastAPI, Depends,Body
from pydantic import BaseModel
from langchain.agents import AgentType
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_experimental.agents.agent_toolkits import create_csv_agent
from langchain_experimental.tools.python.tool import PythonREPLTool
from langchain.agents import initialize_agent, Tool,AgentType
from llama_index.llms.openrouter import OpenRouter
from llama_index.agent.openai import OpenAIAgent
from llama_index.core.llms import ChatMessage
from llama_index.experimental.query_engine import PandasQueryEngine
from langchain_groq import ChatGroq
import json
import requests
from bs4 import BeautifulSoup
import ast
import pandas as pd
from yt_dlp import YoutubeDL
from langchain_community.document_loaders import YoutubeLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.retrievers import EnsembleRetriever, BM25Retriever
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import DocumentCompressorPipeline, LLMChainFilter
from langchain_community.document_transformers import EmbeddingsRedundantFilter
from langchain.retrievers.document_compressors import FlashrankRerank
from langchain.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
import re
from pydantic import BaseModel, Field
from typing import Optional
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from datetime import datetime
from langchain.document_loaders import TextLoader
from langchain_cohere import CohereRerank
api_key="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"
groq = ChatGroq(
    api_key=api_key,
    model="gemma2-9b-it",
)

def load_and_process_data():
    try:
        #texts=text
        loader = TextLoader("./manu.txt")
        texts=loader.load()
        chunking = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=30)
        chunks = chunking.split_documents(texts)
        db = FAISS.from_documents(chunks, GoogleGenerativeAIEmbeddings(google_api_key="AIzaSyCYft-LY8iU8aLtqvfYyOn4YRmsoa4Hl48", model="models/embedding-001"))
        return db, chunks
    except UnicodeDecodeError as e:
        print(f"Error decoding file nothing: {e}")
        raise
    except Exception as e:
        print(f"Error loading data: {e}")
        raise
def Rag_Calling(final_retriver):
    _redudentfilter = EmbeddingsRedundantFilter(embeddings=GoogleGenerativeAIEmbeddings(google_api_key="AIzaSyCYft-LY8iU8aLtqvfYyOn4YRmsoa4Hl48", model="models/embedding-001"))
    rerank = CohereRerank(cohere_api_key="EA5kdJri7hsSOW2i801sXGQSZgW1iP5GwPsB3MF1",model="rerank-english-v3.0")
    pipeline = DocumentCompressorPipeline(transformers=[_redudentfilter, rerank])
    final_chain = ContextualCompressionRetriever(base_compressor=pipeline, base_retriever=final_retriver)
    return final_chain


class Medical_Old_report(BaseModel):
    query:str

@app.post("/medical_report")
def Medical_Old_Reports(query:Medical_Old_report): 
    db,chunks=load_and_process_data()
    retriver1 = db.as_retriever(search_kwargs={"k": 4})
    retriver2 = BM25Retriever.from_documents(chunks, k=4)
    final_retriver = EnsembleRetriever(retrievers=[retriver1, retriver2], weights=[0.5, 0.5])
    template = "You should answer the question based on the context. Context: {context} and Question: {question}"
    prompt = PromptTemplate.from_template(template)
    retriver = Rag_Calling(final_retriver)
    chain = (
            {
                "context": retriver,
                "question": RunnablePassthrough()
            }
            | prompt
            | groq
            | StrOutputParser()
        )
        
    final_chain=chain
    result=final_chain.invoke(query.query)
    return {"result": result}


#--------------------------------------------------------------Scan --------------------------------------------------------------------------------------
from langchain_together import ChatTogether
api_key="9ff4442add386aaadcc7bf2df155391a268d690b1c0cf4b28992a86483bfa396"
together = ChatTogether(
        api_key=api_key,
        model="google/gemma-2-27b-it",
    )
import PIL.Image
import google.generativeai as genai
from typing import List
scan_memory: List[dict] = []

from fastapi import FastAPI, UploadFile, File, Query
@app.post("/scan")
async def scan(image_file: UploadFile = File(...)):
    image_bytes = await image_file.read()
    image = PIL.Image.open(io.BytesIO(image_bytes))
    client = genai.Client(api_key="AIzaSyCyB9rgwo4e0WoZS-CIulrcs_fzg2IEuwc")
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=["Analyze the provided dental X-ray/intraoral image and generate a detailed diagnosis report. Identify cavities, gum disease, misalignment, impacted teeth, bone loss, or any other abnormalities. Provide a structured report with findings, potential causes, No need to recomend treatment.", image])
    diagnosis_report = response.text if response else "No response received."
    scan_memory.append({"Analysis":"The Analysis of the Image", "diagnosis": diagnosis_report})
    print(diagnosis_report)
    return {"diagnosis": diagnosis_report}

# Query past diagnoses
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain.prompts import ChatPromptTemplate,MessagesPlaceholder
store = {}


def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

config={"configurable": {"session_id": "first_chat"}}
@app.post("/query")
async def query_diagnosis(query: str = Body(..., embed=True)):
    
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", "you should give answer based on the question"),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}")
        ]
    )
    
    chain = prompt | together
    history = get_session_history("first_chat")
    history.add_message({"role": "assistant", "content": scan_memory[0]["diagnosis"]})
    
    with_message_history = RunnableWithMessageHistory(
        chain,
        get_session_history,
        input_messages_key="input",
        history_messages_key="history",
    )
    
    result = with_message_history.invoke({"input": query}, config=config)
    history.add_message({"role":"user","content":query})
    history.add_message({"role":"assistant","content":result.content})
    print(store)
    return {"result": result}

@app.post("/clear_memory")
async def clear_memory():
    """Clears the memory when a new chat session begins."""
    scan_memory.clear()
    return {"message": "Memory cleared successfully."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
