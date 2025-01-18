import React, { useState, useRef } from "react";
import axios from "axios";
import {Bars} from 'react-loader-spinner';

function App() {
  const [loading,setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcription, setTranscription] = useState(null);
  const [contextText,setContextText] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleTextSubmit = async () => {

    const formData = new FormData();
    formData.append("context", contextText);

    try {
      const response = await axios.post("http://localhost:8000/text/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(response.data.message);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

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
          mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/m4a' });
            setAudioBlob(audioBlob);
            audioChunksRef.current = [];
          };
          mediaRecorderRef.current.start();
          setIsRecording(true);
        })
        .catch(error => console.error("Error accessing microphone:", error));
    }
  };

  const handleAudioSubmit = async () => {
    if (!audioBlob) {
      alert('No audio recorded.');
      return;
    }

    const formData = new FormData();
    formData.append("file", audioBlob, "recording.m4a");

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/voice/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTranscription(response.data.transcription);
      setResult(response.data.result);
    } catch (error) {
      console.error("Error uploading audio:", error);
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
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">BabyGroqFood: Calorie Estimator</h1>

      {/* Buttons for Recording */}
      <div className="flex flex-col items-center space-y-4 mb-6">
        <div className="flex space-x-4">
          <button
            onClick={handleRecordClick}
            className={`px-6 py-2 rounded-lg text-white ${
              isRecording ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
          <button
            onClick={handleAudioSubmit}
            disabled={!audioBlob}
            className={`px-6 py-2 rounded-lg ${
              audioBlob
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Upload Recording
          </button>
        </div>
        {transcription && (
          <p className="text-lg font-medium text-gray-700 mt-4">
            Transcription: <span className="font-bold text-green-600">{transcription}</span>
          </p>
        )}
      </div>

      {/* File Upload */}
      <div className="flex flex-col items-center space-y-4 mb-6">
        <input
          type="file"
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
        <button
          onClick={handleSubmit}
          className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
        >
          Upload
        </button>
        {imagePreview && (
          <img src={imagePreview} alt="Selected" className="mt-4 max-w-xs rounded-lg shadow-md" />
        )}
      </div>

      {/* Start Over Button */}
      <button
        onClick={handleReset}
        className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white mb-6"
      >
        Start Over
      </button>

      {/* Context box and button*/}
      <div>
        <input
          type = "text"
          placeholder="Context"
          onChange={(e) => setContextText(e.target.value)}
          value = {contextText}
        ></input>

        <button        
        onClick={handleTextSubmit}
        className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
        >text Button</button>
        </div>

      {/* Display Result */}
      {result === null && loading &&
      (<BallTriangle
        height={100}
        width={100}
        radius={5}
        color="#4fa94d"
        ariaLabel="ball-triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        />)}
      {result && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg font-medium text-gray-700">
            Estimated Calories: <span className="font-bold text-green-600">{result}</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;