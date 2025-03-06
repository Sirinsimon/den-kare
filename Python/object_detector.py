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
    allow_origins=["*"],  # You can specify specific origins like ["http://localhost:3000"]
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)