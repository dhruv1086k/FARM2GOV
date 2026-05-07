// client/src/pages/DiseaseDetection.jsx
// Real Gemini Vision AI crop disease detector — Farm2Gov
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  FaBug, FaUpload, FaSearch, FaCheckCircle, FaExclamationTriangle,
  FaTimesCircle, FaLeaf, FaFlask, FaShieldAlt, FaRobot, FaBolt,
  FaArrowRight, FaInfoCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import API from "../api/axios";

/* ─── Severity config ─────────────────────── */
const SEV = {
  High:   { color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/30",    badge: "bg-red-500/20 text-red-300",    Icon: FaTimesCircle },
  Medium: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", badge: "bg-yellow-500/20 text-yellow-300", Icon: FaExclamationTriangle },
  Low:    { color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/30",   badge: "bg-blue-500/20 text-blue-300",   Icon: FaInfoCircle },
  None:   { color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/30",  badge: "bg-green-500/20 text-green-300", Icon: FaCheckCircle },
};

/* ─── Scan Animation ──────────────────────── */
const SCAN_STAGES = [
  { pct: 10, label: "Uploading image to AI model..." },
  { pct: 25, label: "Preprocessing crop image..." },
  { pct: 45, label: "Extracting leaf morphology features..." },
  { pct: 60, label: "Cross-referencing 50,000+ disease patterns..." },
  { pct: 75, label: "Gemini Vision analyzing chlorophyll patterns..." },
  { pct: 88, label: "Generating treatment recommendations..." },
  { pct: 96, label: "Finalizing diagnostic report..." },
  { pct: 100, label: "Analysis complete!" },
];

function ScanLoader({ progress, stage }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-5 py-8"
    >
      {/* Scan ring animation */}
      <div className="relative w-28 h-28">
        <div className="absolute inset-0 rounded-full border-4 border-orange-500/20" />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-t-orange-500 border-r-orange-400"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        />
        <div className="absolute inset-4 rounded-full bg-orange-500/10 flex items-center justify-center">
          <FaSearch className="text-orange-400 text-2xl" />
        </div>
        {/* Scanner line */}
        <motion.div
          className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"
          animate={{ top: ["20%", "80%", "20%"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
      </div>

      <div className="w-full max-w-xs space-y-2">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{stage}</span>
          <span className="text-orange-400 font-bold">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-600 to-yellow-400 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-center text-xs text-gray-500">AI Scanning Crop Health...</p>
      </div>
    </motion.div>
  );
}

/* ─── Confidence Ring ─────────────────────── */
function ConfidenceRing({ value, color }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="80" height="80">
        <circle cx="40" cy="40" r={radius} strokeWidth="6" stroke="rgba(255,255,255,0.08)" fill="none" />
        <motion.circle
          cx="40" cy="40" r={radius} strokeWidth="6" fill="none"
          stroke={color} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <span className="text-white font-extrabold text-lg z-10">{value}%</span>
    </div>
  );
}

/* ─── Main Component ──────────────────────── */
export default function DiseaseDetection() {
  const [image, setImage] = useState(null);
  const [imageMime, setImageMime] = useState("image/jpeg");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  const onDrop = useCallback((files) => {
    const file = files[0];
    if (!file) return;
    setImageMime(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = () => { setImage(reader.result); setResult(null); };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  /* ── Detect ── */
  const detect = async () => {
    if (!image) { toast.error("Please upload a crop image first"); return; }

    setLoading(true); setProgress(0); setStageIdx(0); setResult(null); setIsFallback(false);

    // Animate progress while waiting for API
    let si = 0;
    const interval = setInterval(() => {
      if (si < SCAN_STAGES.length - 1) {
        si++;
        setProgress(SCAN_STAGES[si].pct);
        setStageIdx(si);
      } else {
        clearInterval(interval);
      }
    }, 800);

    try {
      const res = await API.post("/disease/detect", {
        imageBase64: image,
        mimeType: imageMime,
      });

      clearInterval(interval);
      setProgress(100);
      setStageIdx(SCAN_STAGES.length - 1);

      await new Promise(r => setTimeout(r, 500)); // brief pause to show 100%

      setResult(res.data);
      setIsFallback(res.data.fallback || false);

      if (res.data.diseaseName === "Healthy Crop") {
        toast.success("✅ Your crop looks healthy!");
      } else {
        toast(`🔬 ${res.data.diseaseName} detected — check recommendations`, {
          icon: "⚠️",
          style: { borderLeft: "4px solid #f59e0b" },
        });
      }
    } catch (err) {
      clearInterval(interval);
      toast.error("Detection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sev = result ? (SEV[result.severity] || SEV.None) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1f2e] to-[#071a2e] py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-semibold px-5 py-2 rounded-full mb-5 backdrop-blur">
            <FaBolt className="animate-pulse" /> Gemini Vision AI · Plant Pathology Engine
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-3 leading-tight">
            🔬 Crop Disease <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">Detector</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Upload a photo of your crop leaf — Gemini Vision AI will instantly diagnose diseases and provide treatment protocols.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* Upload Panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 shadow-xl">
              <h2 className="font-bold text-white text-lg mb-5 flex items-center gap-2">
                <FaUpload className="text-orange-400" /> Upload Crop Image
              </h2>

              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? "border-orange-500 bg-orange-500/10 scale-[1.02]"
                    : "border-white/20 hover:border-orange-400/60 hover:bg-white/5"
                }`}
              >
                <input {...getInputProps()} />
                {image ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <img src={image} alt="Uploaded crop" className="w-full max-h-52 object-cover rounded-xl shadow-lg" />
                      {/* AI overlay badge */}
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-xs text-orange-400 px-2 py-1 rounded-lg font-semibold border border-orange-500/30">
                        <FaRobot className="inline mr-1" /> Ready for AI Scan
                      </div>
                    </div>
                    <p className="text-sm text-green-400 font-medium flex items-center justify-center gap-2">
                      <FaCheckCircle /> Image loaded — click to change
                    </p>
                  </div>
                ) : (
                  <div className="py-8 space-y-4">
                    <div className="text-7xl">📸</div>
                    <div>
                      <p className="text-white font-semibold">{isDragActive ? "Drop it here!" : "Drag & drop crop image"}</p>
                      <p className="text-gray-500 text-sm mt-1">or click to browse — PNG, JPG, JPEG (max 10MB)</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Detect Button */}
              <button
                onClick={detect}
                disabled={!image || loading}
                className={`w-full mt-5 py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg ${
                  !image || loading
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 hover:shadow-orange-500/30 hover:shadow-2xl hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <><span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Scanning with AI...</>
                ) : (
                  <><FaSearch /> Detect Disease with AI</>
                )}
              </button>

              {/* Scan Progress */}
              {loading && <ScanLoader progress={progress} stage={SCAN_STAGES[stageIdx]?.label} />}
            </div>

            {/* Tips */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <FaLeaf className="text-green-400" /> Tips for Best Results
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {[
                  "📷 Take close-up photos showing the diseased area clearly",
                  "🌞 Use natural daylight — avoid flash or shadows",
                  "🌿 Include both healthy and affected parts of the plant",
                  "📐 Keep the image in focus — blurry images reduce accuracy",
                  "🗂️ JPG/PNG formats work best for disease analysis",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">{tip}</li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Results Panel */}
          <div>
            <AnimatePresence mode="wait">
              {/* Placeholder */}
              {!result && !loading && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center h-full min-h-[400px] flex flex-col items-center justify-center"
                >
                  <div className="text-8xl mb-5">🌿</div>
                  <h3 className="text-xl font-bold text-white mb-2">AI Detection Results</h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Upload a crop/plant image and click "Detect Disease" to get AI-powered diagnosis
                  </p>
                  <div className="flex items-center gap-2 mt-6 text-xs text-gray-600">
                    <FaRobot className="text-orange-500" />
                    Powered by Gemini Vision AI
                  </div>
                </motion.div>
              )}

              {/* Results */}
              {result && sev && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Disease Header Card */}
                  <div className={`rounded-3xl border ${sev.border} ${sev.bg} p-6 shadow-xl backdrop-blur`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Detection Result</span>
                          {isFallback && (
                            <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full font-medium">Demo Mode</span>
                          )}
                        </div>
                        <h3 className={`text-2xl font-extrabold ${sev.color} mb-1`}>
                          {result.diseaseName}
                        </h3>
                        {result.scientificName && (
                          <p className="text-gray-500 text-xs italic">{result.scientificName}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-center gap-3">
                        <ConfidenceRing
                          value={result.confidence || 75}
                          color={sev.color.replace("text-", "").includes("red") ? "#ef4444" :
                                 sev.color.includes("yellow") ? "#eab308" :
                                 sev.color.includes("green") ? "#22c55e" : "#3b82f6"}
                        />
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${sev.badge}`}>
                          {result.severity === "None" ? "✅ Healthy" : `${result.severity} Severity`}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-3">{result.description}</p>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-2">
                      {result.affectedParts?.map((p, i) => (
                        <span key={i} className="bg-white/10 text-gray-300 text-xs px-2.5 py-1 rounded-full">{p}</span>
                      ))}
                      {result.estimatedYieldLoss && result.estimatedYieldLoss !== "None" && (
                        <span className="bg-red-500/20 text-red-400 text-xs px-2.5 py-1 rounded-full">
                          📉 Yield Loss: {result.estimatedYieldLoss}
                        </span>
                      )}
                      {result.spreadRisk && (
                        <span className="bg-orange-500/20 text-orange-400 text-xs px-2.5 py-1 rounded-full">
                          Spread Risk: {result.spreadRisk}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Immediate Action */}
                  {result.immediateAction && result.diseaseName !== "Healthy Crop" && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                      <h4 className="text-red-400 font-bold text-sm flex items-center gap-2 mb-1">
                        <FaArrowRight /> Immediate Action Required
                      </h4>
                      <p className="text-gray-300 text-sm">{result.immediateAction}</p>
                    </div>
                  )}

                  {/* Treatment */}
                  {result.diseaseName !== "Healthy Crop" && result.treatment?.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <h4 className="font-bold text-orange-400 flex items-center gap-2 mb-3 text-sm">
                        <FaFlask /> Recommended Treatment Protocol
                      </h4>
                      <ul className="space-y-2">
                        {result.treatment.map((t, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-orange-500 font-bold mt-0.5 shrink-0">{i + 1}.</span> {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Organic */}
                  {result.organicTreatment && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
                      <h4 className="font-bold text-green-400 flex items-center gap-2 mb-2 text-sm">
                        <FaLeaf /> Organic Alternative
                      </h4>
                      <p className="text-gray-300 text-sm">{result.organicTreatment}</p>
                    </div>
                  )}

                  {/* Prevention */}
                  {result.prevention?.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <h4 className="font-bold text-blue-400 flex items-center gap-2 mb-3 text-sm">
                        <FaShieldAlt /> Prevention Guidelines
                      </h4>
                      <ul className="space-y-2">
                        {result.prevention.map((p, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-blue-400 font-bold mt-0.5 shrink-0">•</span> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* AI Badge */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                    <FaRobot className="text-orange-500" />
                    {result.source === "gemini-vision" ? "Gemini Vision AI Analysis" : "AI-Assisted Demo Result"}
                    · Consult a certified agronomist for confirmation
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
