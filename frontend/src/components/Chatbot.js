import { useState, useRef, useEffect } from "react";
import { apiFetch } from "../utils/api";
import { X, Send, User, Loader2, Sparkles, MessageSquare, Zap, Target, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Chatbot({ userId, onClose }) {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi there! 👋 I'm your AI Career Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);



  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text = input) => {
    const messageToSend = text.trim();
    if (!messageToSend) return;

    const userMsg = { from: "user", text: messageToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await apiFetch("/api/chatbot/ask", {
        method: "POST",
        body: JSON.stringify({
          userId,
          message: messageToSend,
        }),
      });

      const data = await res.json();
      const botMessages = [{ from: "bot", text: data.reply }];

      // --- Handle job lists (match_jobs) ---
      if (data.data && Array.isArray(data.data)) {
        data.data.forEach((job) => { 
          botMessages.push({
            from: "bot",
            text: `📌 ${job.title}\n `,
          });
        });
      }

      // --- Handle missing skills & learning resources ---
      if (data.data?.missingSkills?.length) {
        const skillsText = `🔹 Missing Skills:\n• ${data.data.missingSkills.join(
          "\n• "
        )}`;
        botMessages.push({ from: "bot", text: skillsText });

        if (data.data.learningResources) {
          Object.entries(data.data.learningResources).forEach(
            ([skill, resources]) => {
              const resourcesText = `📘 Learn ${skill}:\n• ${resources.join(
                "\n• "
              )}`;
              botMessages.push({ from: "bot", text: resourcesText });
            }
          );
        }
      }

      setMessages((prev) => [...prev, ...botMessages]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "I'm sorry, I'm having trouble connecting right now. 😕" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-24 right-8 w-[400px] md:w-[450px] h-[600px] bg-white 
                 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 overflow-hidden border border-gray-100 flex flex-col"
    >
      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 p-6 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm border border-white/10">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg tracking-tight">AI Assistant</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
              <p className="text-indigo-100 text-xs font-medium uppercase tracking-wider">Always Online</p>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-all bg-white/10 hover:bg-white/20 p-2 rounded-xl"
        >
          <X size={20} />
        </button>
      </div>

      {/* MESSAGES */}
      <div
        ref={scrollRef}
        className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-50/30 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-3 max-w-[85%] ${m.from === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-sm transition-transform hover:scale-105 ${m.from === "user" ? "bg-indigo-600" : "bg-white border border-gray-100"
                    }`}
                >
                  {m.from === "user" ? (
                    <User size={18} className="text-white" />
                  ) : (
                    <Sparkles size={18} className="text-indigo-600" />
                  )}
                </div>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${m.from === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-white text-gray-700 border border-gray-100 rounded-tl-none whitespace-pre-wrap"
                    }`}
                >
                  {m.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 ml-12 bg-white/50 w-fit px-4 py-2 rounded-xl border border-gray-50"
          >
            <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
            <span className="text-xs font-semibold text-gray-400">Assistant is thinking...</span>
          </motion.div>
        )}
      </div>

      {/* QUICK SUGGESTIONS */}
      {/* <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100/50 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s.text)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 
                         rounded-xl text-xs font-semibold text-gray-600 hover:border-indigo-400 
                         hover:text-indigo-600 hover:bg-indigo-50/30 transition-all shadow-sm active:scale-95"
            >
              <span className="text-indigo-500">{s.icon}</span>
              {s.text}
            </button>
          ))}
        </div>
      </div> */}

      {/* INPUT */}
      <div className="p-6 bg-white border-t border-gray-100">
        <div className="flex gap-3 bg-gray-50 p-1.5 rounded-2xl border border-transparent shadow-inner focus-within:bg-white focus-within:border-indigo-100 focus-within:ring-4 focus-within:ring-indigo-50/50 transition-all">
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none text-gray-800 placeholder:text-gray-400 font-medium"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white p-3 rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-90 flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
