import os
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from ImageProcessing import ImageProcessing
from DescriptionProcessing import DescriptionProcessing
from VoiceProcessing import VoiceProcessing

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
    transcription = voice.processVoice(fileLocation)
    res = dsc.approximateCalories(transcription)    
    print(transcription)
    #os.remove("./frontend/"+fileLocation)
    return {"transcription": transcription, "result": res}


@app.post("/upload/")
async def uploadImage(file: UploadFile = File(...)):
    fileLocation = f"uploads/{file.filename}"
    with open(fileLocation, "wb") as f:
        f.write(await file.read())
    img = ImageProcessing()
    dsc = DescriptionProcessing()
    res = dsc.approximateCalories(img.imageToText(img.encodeImage(fileLocation)))
    print(res)
    #os.remove("./frontend/"+fileLocation)
    return {"message": res}

@app.post("/text/")
async def inputText(context: str = Form(...)):

    dsc = DescriptionProcessing()
    res = dsc.approximateCalories(context)
    print(res)
    return {"message": res}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
