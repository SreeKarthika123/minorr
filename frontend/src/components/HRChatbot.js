import { useState } from "react";

export default function HRChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "hr", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/hr-chatbot/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg.text })
        }
      );

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: JSON.stringify(data.reply, null, 2)
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Error contacting chatbot" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 w-80 bg-white shadow-xl rounded-lg border">
      <div className="p-3 font-bold bg-blue-600 text-white rounded-t">
        HR Assistant 🤖
      </div>

      <div className="p-3 h-64 overflow-y-auto space-y-2 text-sm">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              m.sender === "hr"
                ? "bg-blue-100 text-right"
                : "bg-gray-100"
            }`}
          >
            <pre className="whitespace-pre-wrap">
              {m.text}
            </pre>
          </div>
        ))}
        {loading && <p className="text-gray-400">Typing...</p>}
      </div>

      <div className="flex border-t">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask HR bot..."
          className="flex-1 px-2 py-1 text-sm outline-none"
        />
        <button
          onClick={sendMessage}
          className="px-3 bg-blue-600 text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}
