import Head from "next/head";
import Image from "next/image";
import buildspaceLogo from "../assets/buildspace-logo.png";
import { useState } from "react";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [whisperApiOutput, setWhisperApiOutput] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text);

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  };

  const callWhisperEndpoint = async () => {
    isTranscribing(true);
    const fileInput = document.getElementById("file-upload");
    const audioFile = fileInput.files[0];
    console.log("audio", audioFile);
    const base64data = await toBase64(audioFile);
    console.log("base64data", base64data);
    const base64String = base64data.split(",")[1];
    console.log("base64String", base64String);

    console.log("Calling Replicate...");
    const response = await fetch("/api/transcribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audio: base64String }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output);

    setWhisperApiOutput(`${output}`);
    setIsTranscribing(false);
  };

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };

  return (
    <div className="root">
      <Head>
        <title>Creative AI | Your home for AI generated creatives</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Audio to Email</h1>
          </div>
          <div className="header-subtitle">
            <h2>Generate newsletters from your podcasts</h2>
          </div>
        </div>
        <div className="upload-container">
          <div className="generate">
            <p>Upload an audio file</p>
          </div>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            accept="audio/*"
            className="sr-only"
          />
        </div>
        <div className="prompt-buttons">
          <a
            className={
              isTranscribing ? "generate-button loading" : "generate-button"
            }
            onClick={callWhisperEndpoint}
          >
            <div className="generate">
              {isGenerating ? <span class="loader"></span> : <p>Transcribe</p>}
            </div>
          </a>
        </div>
        {whisperApiOutput && (
          <div className="output">
            <div className="output-header-container">
              <div className="output-header">
                <h3>Output</h3>
              </div>
            </div>
            <div className="output-content">
              <p>{whisperApiOutput}</p>
            </div>
          </div>
        )}
        <div className="prompt-container">
          <textarea
            placeholder="start typing here"
            className="prompt-box"
            value={userInput}
            onChange={onUserChangedText}
          />
        </div>
        <div className="prompt-buttons">
          <a
            className={
              isGenerating ? "generate-button loading" : "generate-button"
            }
            onClick={callGenerateEndpoint}
          >
            <div className="generate">
              {isGenerating ? <span class="loader"></span> : <p>Generate</p>}
            </div>
          </a>
        </div>
        {apiOutput && (
          <div className="output">
            <div className="output-header-container">
              <div className="output-header">
                <h3>Output</h3>
              </div>
            </div>
            <div className="output-content">
              <p>{apiOutput}</p>
            </div>
          </div>
        )}
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
