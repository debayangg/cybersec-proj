import { useState } from "react";
import "./App.css";

function App() {
  // State for encryption
  const [encryptText, setEncryptText] = useState("");
  const [encryptKey, setEncryptKey] = useState("");
  const [encryptedResult, setEncryptedResult] = useState("");
  const [encryptError, setEncryptError] = useState("");

  // State for decryption
  const [decryptText, setDecryptText] = useState("");
  const [decryptKey, setDecryptKey] = useState("");
  const [decryptedResult, setDecryptedResult] = useState("");
  const [decryptError, setDecryptError] = useState("");

  // Encrypt function
  const encryptData = async () => {
    setEncryptError("");
    try {
      const response = await fetch("http://127.0.0.1:8000/aes/encrypt/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: encryptText, key: encryptKey }),
      });

      const data = await response.json();
      if (data.error) {
        setEncryptError(data.error);
      } else {
        setEncryptedResult(data.encrypted_text);
      }
    } catch (err) {
      setEncryptError("Encryption failed. Check your backend.");
    }
  };

  // Decrypt function
  const decryptData = async () => {
    setDecryptError("");
    try {
      const response = await fetch("http://127.0.0.1:8000/aes/decrypt/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ encrypted_text: decryptText, key: decryptKey }),
      });

      const data = await response.json();
      if (data.error) {
        setDecryptError(data.error);
      } else {
        setDecryptedResult(data.decrypted_text);
      }
    } catch (err) {
      setDecryptError("Decryption failed. Check your backend.");
    }
  };

  return (
    <div className="container">
      <h1>AES-128 Encryption & Decryption</h1>

      {/* Encryption Section */}
      <div className="section">
        <h2>Encryption</h2>
        <input
          type="text"
          placeholder="Enter text to encrypt"
          value={encryptText}
          onChange={(e) => setEncryptText(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter key"
          value={encryptKey}
          onChange={(e) => setEncryptKey(e.target.value)}
        />
        <button onClick={encryptData}>Encrypt</button>

        {encryptError && <p style={{ color: "red" }}>{encryptError}</p>}
        {encryptedResult && (
          <div>
            <h3>Encrypted Text:</h3>
            <p>{encryptedResult}</p>
          </div>
        )}
      </div>

      {/* Decryption Section */}
      <div className="section">
        <h2>Decryption</h2>
        <input
          type="text"
          placeholder="Enter encrypted text"
          value={decryptText}
          onChange={(e) => setDecryptText(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter key"
          value={decryptKey}
          onChange={(e) => setDecryptKey(e.target.value)}
        />
        <button onClick={decryptData}>Decrypt</button>

        {decryptError && <p style={{ color: "red" }}>{decryptError}</p>}
        {decryptedResult && (
          <div>
            <h3>Decrypted Text:</h3>
            <p>{decryptedResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
