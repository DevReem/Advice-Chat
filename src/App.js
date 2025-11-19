import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  // حفظ وضع Dark Mode
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // جلب رسالة البوت من API
  const getAdvice = async () => {
    try {
      const res = await axios.get("https://api.adviceslip.com/advice");
      return res.data.slip.advice;
    } catch (err) {
      return "Sorry, I couldn't get advice now ";
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // إضافة رسالة المستخدم
    setMessages((prev) => [
      ...prev,
      { from: "user", text: input, avatar: "👤" },
    ]);
    setInput("");

    // إضافة رسالة البوت مباشرة
    const botReply = await getAdvice();
    setMessages((prev) => [
      ...prev,
      { from: "bot", text: botReply, avatar: "🤖" },
    ]);
  };

  // وظيفة Clear Chat
  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className={darkMode ? "chat-container dark" : "chat-container"}>
      <h2>Advice Chat</h2>
      <div className="buttons">
        <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button className="clear-btn" onClick={clearChat}>
          Clear Chat
        </button>
      </div>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.from === "user" ? "msg user-msg" : "msg bot-msg"}
          >
            <span className="avatar">{msg.avatar}</span>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
