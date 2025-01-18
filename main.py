import os
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from ImageProcessing import ImageProcessing
from DescriptionProcessing import DescriptionProcessing
from VoiceProcessing import VoiceProcessing

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/voice/")
async def uploadVoice(file:UploadFile = File(...)):
    fileLocation = f"voice/{file.filename}"
    with open(fileLocation,"wb") as f:
        f.write(await file.read())
    voice = VoiceProcessing()
    dsc = DescriptionProcessing()
    res = dsc.approximateCalories(voice.processVoice())
    print(res)
    os.remove(fileLocation)
    return {"message": res}


@app.post("/upload/")
async def uploadImage(file: UploadFile = File(...)):
    fileLocation = f"uploads/{file.filename}"
    with open(fileLocation, "wb") as f:
        f.write(await file.read())
    img = ImageProcessing()
    dsc = DescriptionProcessing()
    res = dsc.approximateCalories(img.imageToText(img.encodeImage(fileLocation)))
    print(res)
    os.remove(fileLocation)
    return {"message": res}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
