// client/src/pages/VoiceAssistant.jsx
// Real Gemini AI-powered voice assistant — Farm2Gov
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMicrophone, FaMicrophoneSlash, FaRobot, FaUser,
  FaLeaf, FaVolumeUp, FaPaperPlane, FaSpinner, FaBolt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import API from "../api/axios";

/* ─── Quick suggestion chips ───────────────────────────────────────── */
const SUGGESTIONS = [
  "Which crop is best for Punjab this Kharif season?",
  "How can farmers reduce water usage?",
  "What government schemes are available for small farmers?",
  "Why are rice prices increasing this year?",
  "What is PM-KISAN and how to apply?",
  "Best fertilizer for wheat in Rabi season?",
  "How to prevent crop loss from heavy rain?",
  "What is Kisan Credit Card interest rate?",
];

/* ─── Category badge config ────────────────────────────────────────── */
const CATEGORY_STYLE = {
  pricing:  { color: "bg-green-500/20 text-green-300",  label: "💰 Market Price" },
  schemes:  { color: "bg-blue-500/20 text-blue-300",    label: "📋 Govt Scheme" },
  crops:    { color: "bg-emerald-500/20 text-emerald-300", label: "🌾 Crop Advice" },
  weather:  { color: "bg-sky-500/20 text-sky-300",      label: "🌤️ Weather" },
  disease:  { color: "bg-orange-500/20 text-orange-300", label: "🔬 Disease" },
  loans:    { color: "bg-yellow-500/20 text-yellow-300", label: "🏦 Loans" },
  general:  { color: "bg-purple-500/20 text-purple-300", label: "🤖 General" },
};

/* ─── Orb animation (pulse rings) ─────────────────────────────────── */
function ListeningOrb({ active }) {
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      {active && (
        <>
          <span className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
          <span className="absolute inset-2 rounded-full bg-red-500/20 animate-ping [animation-delay:200ms]" />
          <span className="absolute inset-4 rounded-full bg-red-500/10 animate-ping [animation-delay:400ms]" />
        </>
      )}
      <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
        active
          ? "bg-gradient-to-br from-red-600 to-red-400 shadow-red-500/40"
          : "bg-gradient-to-br from-green-600 to-emerald-400 shadow-green-500/30 hover:shadow-green-500/50"
      }`}>
        {active
          ? <FaMicrophoneSlash className="text-white text-2xl" />
          : <FaMicrophone className="text-white text-2xl" />
        }
      </div>
    </div>
  );
}

/* ─── AI Typing indicator ──────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-white/10 rounded-2xl w-fit">
      {[0, 1, 2].map(i => (
        <span key={i} className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

/* ─── Message Bubble ───────────────────────────────────────────────── */
function MessageBubble({ msg, idx }) {
  const isAI = msg.type === "ai";
  const catStyle = CATEGORY_STYLE[msg.category] || CATEGORY_STYLE.general;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.03 * idx, duration: 0.25 }}
      className={`flex items-start gap-3 ${isAI ? "" : "flex-row-reverse"}`}
    >
      {/* Avatar */}
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-md ${
        isAI ? "bg-gradient-to-br from-green-600 to-emerald-500" : "bg-white/20"
      }`}>
        {isAI ? <FaRobot className="text-white text-sm" /> : <FaUser className="text-white text-sm" />}
      </div>

      {/* Content */}
      <div className={`max-w-[78%] ${isAI ? "" : "items-end flex flex-col"}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
          isAI
            ? "bg-white/10 text-white border border-white/10 backdrop-blur-sm"
            : "bg-gradient-to-br from-green-600 to-emerald-500 text-white"
        }`}>
          {msg.text}
        </div>
        {/* Category + Related Topics */}
        {isAI && msg.category && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${catStyle.color}`}>
              {catStyle.label}
            </span>
            {msg.relatedTopics?.slice(0, 2).map((t, i) => (
              <span key={i} className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────── */
export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "🙏 Namaskar! I am KrishiBot, your Farm2Gov AI farming assistant powered by Gemini AI.\n\nAsk me anything about:\n• Crop prices & MSP rates\n• Government schemes (PM-KISAN, PMFBY, KCC)\n• Best crops for your region & season\n• Pest control & disease management\n• Loans, subsidies & insurance\n\nSpeak or type your question below! 🌾",
      category: "general",
    },
  ]);
  const [textInput, setTextInput] = useState("");
  const [supported, setSupported] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setSupported(false);
    }
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  /* ── Call Gemini API ── */
  const askGemini = useCallback(async (question) => {
    setIsThinking(true);
    try {
      const res = await API.post("/voice/ask", { question });
      const data = res.data;
      const aiMsg = {
        type: "ai",
        text: data.answer || "I couldn't find a specific answer for that. Please try rephrasing your question.",
        category: data.category || "general",
        relatedTopics: data.relatedTopics || [],
      };
      setMessages(prev => [...prev, aiMsg]);

      // Speak response
      speakText(aiMsg.text);
    } catch (err) {
      const fallback = getFallbackResponse(question);
      setMessages(prev => [...prev, { type: "ai", text: fallback, category: "general" }]);
    } finally {
      setIsThinking(false);
    }
  }, []);

  /* ── Text-to-Speech ── */
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[🌾🙏💰📋🔬🌤️🏦📊💳☔🏪⚡🤖🌱💹•→]/gu, "").trim();
    const utterance = new SpeechSynthesisUtterance(clean.substring(0, 300));
    utterance.lang = "en-IN";
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  /* ── Add user message ── */
  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { type: "user", text }]);
  };

  /* ── Speech Recognition ── */
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Use Chrome or Edge for voice support.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onstart = () => { setListening(true); setTranscript(""); };
    recognition.onresult = (event) => {
      const text = event.results[event.results.length - 1][0].transcript;
      setTranscript(text);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = (e) => {
      setListening(false);
      if (e.error === "no-speech") toast.error("No speech detected. Try again.");
      if (e.error === "not-allowed") toast.error("Microphone access denied.");
    };
    recognition.addEventListener("result", (event) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal && result[0].transcript.trim()) {
        const text = result[0].transcript.trim();
        addUserMessage(text);
        setTranscript("");
        recognition.stop();
        askGemini(text);
      }
    });
    recognition.start();
    toast("🎤 Listening... Speak now", { duration: 2000 });
  };

  const stopListening = () => { recognitionRef.current?.stop(); setListening(false); };
  const stopSpeaking = () => { window.speechSynthesis?.cancel(); setIsSpeaking(false); };

  /* ── Text submit ── */
  const handleSubmit = (e) => {
    e?.preventDefault();
    const q = textInput.trim();
    if (!q || isThinking) return;
    addUserMessage(q);
    setTextInput("");
    askGemini(q);
  };

  /* ── Suggestion click ── */
  const useSuggestion = (s) => {
    if (isThinking) return;
    addUserMessage(s);
    askGemini(s);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030d1a] via-[#071428] to-[#020a14] py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-semibold px-5 py-2 rounded-full mb-4 backdrop-blur">
            <FaBolt className="animate-pulse" /> Gemini AI · KrishiBot Agricultural Assistant
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
            🎙️ Farm2Gov <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300">Voice AI</span>
          </h1>
          <p className="text-gray-400">Ask questions about crops, prices & schemes — in voice or text</p>
        </motion.div>

        {/* Chat Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Status Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-semibold">KrishiBot Online</span>
            </div>
            {isSpeaking && (
              <button onClick={stopSpeaking} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition">
                <FaVolumeUp className="text-green-400" /> Speaking... (click to stop)
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="h-[420px] overflow-y-auto p-5 space-y-4 scroll-smooth">
            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} idx={i} />)}

            {/* Interim transcript */}
            {transcript && (
              <div className="flex items-start gap-3 flex-row-reverse">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <FaUser className="text-white text-sm" />
                </div>
                <div className="bg-green-500/30 rounded-2xl px-4 py-3 text-sm text-white/80 italic max-w-[78%] border border-green-500/20">
                  {transcript}<span className="animate-pulse">|</span>
                </div>
              </div>
            )}

            {/* AI Thinking */}
            {isThinking && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center">
                  <FaRobot className="text-white text-sm" />
                </div>
                <div>
                  <TypingIndicator />
                  <p className="text-gray-500 text-xs mt-1.5 ml-1 animate-pulse">Consulting agricultural databases...</p>
                </div>
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Controls */}
          <div className="border-t border-white/10 p-5 space-y-4">
            {/* Mic Button */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={listening ? stopListening : startListening}
                disabled={!supported || isThinking}
                className="transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
              >
                <ListeningOrb active={listening} />
              </button>
              <p className="text-sm text-center">
                {listening ? (
                  <span className="text-red-400 font-semibold animate-pulse">🔴 Listening... Click to stop</span>
                ) : isThinking ? (
                  <span className="text-gray-500 flex items-center gap-1 justify-center"><FaSpinner className="animate-spin" /> AI is thinking...</span>
                ) : (
                  <span className="text-gray-500">Click microphone to speak</span>
                )}
              </p>
            </div>

            {/* Quick Suggestions */}
            <div>
              <p className="text-gray-500 text-xs mb-2 text-center">Try asking:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTIONS.slice(0, 4).map(s => (
                  <button
                    key={s}
                    onClick={() => useSuggestion(s)}
                    disabled={isThinking}
                    className="text-xs bg-white/5 hover:bg-white/15 disabled:opacity-40 text-green-300 border border-white/10 px-3 py-1.5 rounded-full transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSubmit(e)}
                placeholder="Or type your farming question here..."
                disabled={isThinking}
                className="flex-1 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 transition disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!textInput.trim() || isThinking}
                className="bg-gradient-to-br from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 disabled:opacity-40 text-white px-4 py-3 rounded-xl transition shadow-lg flex items-center gap-2"
              >
                {isThinking ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
              </button>
            </form>

            {!supported && (
              <p className="text-center text-red-400 text-xs">⚠️ Voice not supported. Use Chrome or Edge.</p>
            )}
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-5 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5"
        >
          <h3 className="text-white font-bold flex items-center gap-2 mb-3">
            <FaLeaf className="text-green-400" /> Try These Questions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-400">
            {SUGGESTIONS.slice(4).map(s => (
              <button
                key={s}
                onClick={() => useSuggestion(s)}
                disabled={isThinking}
                className="flex items-center gap-2 text-left hover:text-green-300 transition disabled:opacity-40"
              >
                <FaVolumeUp className="text-green-600 text-xs shrink-0" /> {s}
              </button>
            ))}
          </div>
        </motion.div>

        <p className="text-center text-gray-700 text-xs mt-4">
          ⚡ Powered by Gemini AI · Responses are AI-generated agricultural guidance · Verify with local experts
        </p>
      </div>
    </div>
  );
}

/* ─── Fallback if API fails ─────────────────────────────────────────── */
function getFallbackResponse(question) {
  const q = question.toLowerCase();
  if (q.includes("pm kisan") || q.includes("pm-kisan"))
    return "💰 PM-KISAN provides ₹6,000/year in 3 installments to eligible farmer families. Register at pmkisan.gov.in with your Aadhaar and land records.";
  if (q.includes("scheme") || q.includes("yojana"))
    return "📋 Key farmer schemes: PM-KISAN (₹6,000/yr), PMFBY (crop insurance), KCC (4% credit), eNAM (digital mandi). Visit agricoop.nic.in for full details.";
  if (q.includes("rice") || q.includes("wheat") || q.includes("price"))
    return "💹 Current MSP: Wheat ₹2,275/qtl, Paddy ₹2,183/qtl, Soybean ₹4,600/qtl. Check cacp.dacnet.nic.in for latest rates.";
  if (q.includes("water") || q.includes("irrigation"))
    return "🌊 Drip irrigation saves 40-60% water. Sprinkler systems reduce usage by 30%. PM Krishi Sinchai Yojana provides 55% subsidy on drip systems.";
  return "🤖 I'm having trouble connecting to the AI service right now. Please try again in a moment, or visit the Kisan Call Centre at 1800-180-1551 (toll-free).";
}
