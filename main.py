from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from ImageProcessing import ImageProcessing
from DescriptionProcessing import DescriptionProcessing

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload/")
async def uploadImage(file: UploadFile = File(...)):
    img = ImageProcessing()
    dsc = DescriptionProcessing()
    return {"message": dsc.approximateCalories(img.imageToText(img.encodeImage(file)))}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
