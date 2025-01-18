import React, { useState, useRef } from "react";
import axios from "axios";
import { TailSpin } from 'react-loader-spinner';
import { TailSpin } from 'react-loader-spinner';

function App() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcription, setTranscription] = useState(null);
  const [contextText, setContextText] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleTextSubmit = async () => {
    const formData = new FormData();
    formData.append("context", contextText);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/text/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      setResult(response.data.message);
    } catch (error) {
      console.error("Error uploading text:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("file", image);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      setResult(response.data.message);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleRecordClick = () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      // Start recording
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = event => {
            audioChunksRef.current.push(event.data);
          };
          mediaRecorderRef.current.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/m4a' });
            setAudioBlob(audioBlob);
            audioChunksRef.current = [];

            // Automatically send the POST request when recording stops
            const formData = new FormData();
            formData.append("file", audioBlob, "recording.m4a");

            try {
              setLoading(true);
              const response = await axios.post("http://localhost:8000/voice/", formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              });
              setLoading(false);
              setTranscription(response.data.transcription);
              setResult(response.data.result);
            } catch (error) {
              console.error("Error uploading audio:", error);
            } finally {
              setLoading(false);
            }
          };
          mediaRecorderRef.current.start();
          setIsRecording(true);
        })
        .catch(error => console.error("Error accessing microphone:", error));
    }
  };

  const handleReset = () => {
    setImage(null);
    setImagePreview(null);
    setResult(null);
    setAudioBlob(null);
    setTranscription(null);
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    audioChunksRef.current = [];
  };

  return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white py-10 px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">BabyGroqFood</h1>
          <h1 className="text-xl mb-8 text-center">Calorie Estimator</h1>
    
          {/* Main Container */}
          <div className="w-full max-w-lg space-y-6">
    
            {/* Audio Recording Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
              <div className="flex justify-center">
                <button
                  onClick={handleRecordClick}
                  className={`px-6 py-2 rounded-lg transition-colors duration-200 ${
                    isRecording
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </button>
              </div>
              {transcription && (
                <p className="text-center text-lg font-medium">
                  Transcription: <span className="font-bold">{transcription}</span>
                </p>
              )}
            </div>
    
            {/* File Upload Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:bg-gray-700 file:text-white
                  hover:file:bg-gray-600
                "
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="mx-auto max-w-full rounded-lg shadow-md"
                />
              )}
              <button
                onClick={handleSubmit}
                className="w-full px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Upload
              </button>
            </div>
    
            {/* Start Over Button */}
            <button
              onClick={handleReset}
              className="w-full px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors duration-200"
            >
              Start Over
            </button>
    
            {/* Context Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
              <input
                type="text"
                placeholder="Context"
                onChange={(e) => setContextText(e.target.value)}
                value={contextText}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 placeholder-gray-400 text-white
                  focus:outline-none focus:ring-2 focus:ring-blue-600
                "
              />
              <button
                onClick={handleTextSubmit}
                className="w-full px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Text Button
              </button>
            </div>
    
            {/* Loading Spinner or Result */}
            {result === null && loading && (
              <div className="flex justify-center">
                <TailSpin
                  visible={true}
                  height="80"
                  width="80"
                  color="#4fa94d"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  wrapperStyle={{}}
                  wrapperClass=""
                  />
              </div>
            )}
            {result && (
              <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
                <p className="text-lg font-medium">
                  Estimated Calories: <span className="font-bold">{result}</span>
                </p>
              </div>
            )}
          </div>
        </div>

  );
}

export default App;