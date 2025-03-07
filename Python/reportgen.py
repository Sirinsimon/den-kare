from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from PIL import Image

def create_pdf(output_path, body_text, image_path):
    c = canvas.Canvas(output_path, pagesize=letter)
    width, height = letter

    # Title
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(width / 2, height - 100, "REPORTS")

    # Body Text
    c.setFont("Helvetica", 12)
    text_y = height - 150
    for line in body_text.split("\n"):
        c.drawString(100, text_y, line)
        text_y -= 20  

    # Load Image and Get Its Size
    img = Image.open(image_path)
    img_width, img_height = img.size

    # Scale Image to Fit the Page Width (if needed)
    max_width = width - 200  # Keeping some margin
    if img_width > max_width:
        scale = max_width / img_width
        img_width = max_width
        img_height *= scale

    # Insert Image
    c.drawImage(image_path, 100, text_y - img_height - 20, width=img_width, height=img_height)

    c.save()
    print(f"PDF saved at: {output_path}")

# Usage