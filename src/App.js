import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "./App.css";

const App = () => {
  const [htmlCode, setHtmlCode] = useState(localStorage.getItem("html") || "");
  const [cssCode, setCssCode] = useState(localStorage.getItem("css") || "");
  const [jsCode, setJsCode] = useState(localStorage.getItem("js") || "");
  const [imageUrl, setImageUrl] = useState("");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    localStorage.setItem("html", htmlCode);
    localStorage.setItem("css", cssCode);
    localStorage.setItem("js", jsCode);
  }, [htmlCode, cssCode, jsCode]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const downloadCodeAsZip = () => {
    const zip = new JSZip();
    zip.file("index.html", htmlCode);
    zip.file("style.css", cssCode);
    zip.file("script.js", jsCode);

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "code-editor.zip");
    });
  };

  return (
    <div className={`container ${darkMode ? "dark-mode" : "light-mode"}`}>
      {/* Navbar */}
      <div className="navbar">
        <h2>Online Code Editor</h2>
        <div className="nav-buttons">
          <button className="toggle-mode" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button className="download-btn" onClick={downloadCodeAsZip}>📥 Download ZIP</button>
        </div>
      </div>

      {/* Code Editor Section */}
      <div className="editor-container">
        <div className="editor">
          <h3>HTML</h3>
          <CodeMirror value={htmlCode} height="200px" theme={darkMode ? oneDark : "light"} extensions={[html()]} onChange={setHtmlCode} />
        </div>
        <div className="editor">
          <h3>CSS</h3>
          <CodeMirror value={cssCode} height="200px" theme={darkMode ? oneDark : "light"} extensions={[css()]} onChange={setCssCode} />
        </div>
        <div className="editor">
          <h3>JavaScript</h3>
          <CodeMirror value={jsCode} height="200px" theme={darkMode ? oneDark : "light"} extensions={[javascript()]} onChange={setJsCode} />
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="upload-container">
        <input type="file" onChange={handleImageUpload} />
        {imageUrl && (
          <div className="image-link">
            <input type="text" value={imageUrl} readOnly />
            <button onClick={() => navigator.clipboard.writeText(imageUrl)}>Copy URL</button>
          </div>
        )}
      </div>

      {/* Output Section */}
      <div className="output-container">
        <h3>Live Preview</h3>
        <iframe
          title="Output"
          srcDoc={`<html><head><style>${cssCode}</style></head><body>${htmlCode}<script>${jsCode}</script></body></html>`}
          className="output-frame"
        />
      </div>
    </div>
  );
};

export default App;
