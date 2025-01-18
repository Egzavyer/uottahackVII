import os
from groq import Groq


class VoiceProcessing:
    def __init__(self):
        self.client = Groq(
            api_key=os.environ.get("GROQ_API_KEY"),
        )
        self.model = "whisper-large-v3"
        
    def processVoice(self, audioFile):
        with open(audioFile,"rb") as file:
            transcription = self.client.audio.transcriptions.create(
                file = (audioFile,file.read()),
                model = self.model,
                prompt = "Transcript as accurately as possible",
                response_format="json",
                language="en",
                temperature=0.0
            ) 
        return transcription.text