// client/src/pages/PricePredictor.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRobot, FaLeaf, FaChartBar, FaThermometerHalf,
  FaArrowUp, FaArrowDown, FaMinus, FaCheckCircle,
  FaExclamationTriangle, FaFireAlt, FaShieldAlt,
  FaLightbulb, FaStar, FaGlobe,
} from "react-icons/fa";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Area, AreaChart, ReferenceLine,
} from "recharts";
import toast from "react-hot-toast";
import API from "../api/axios";

/* ─── Static Data ─────────────────────────── */
const CROPS = [
  "Rice","Wheat","Maize","Bajra","Jowar","Barley","Ragi","Sorghum",
  "Soybean","Mustard","Sunflower","Groundnut","Cotton","Sugarcane",
  "Potato","Tomato","Onion","Cauliflower","Cabbage","Carrot",
  "Banana","Mango","Papaya","Apple","Grapes","Orange",
  "Turmeric","Ginger","Cardamom","Black Pepper","Coriander",
  "Chickpea","Lentil","Green Gram","Black Gram","Pigeon Pea",
];
const STATES = [
  "Andhra Pradesh","Assam","Bihar","Gujarat","Haryana","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan",
  "Tamil Nadu","Telangana","Uttar Pradesh","Uttarakhand","West Bengal","Delhi",
];
const SEASONS = ["Kharif", "Rabi", "Zaid"];
const SOILS = ["Black Cotton Soil","Red Soil","Alluvial Soil","Laterite Soil","Sandy Soil","Loamy Soil"];
const WEATHERS = ["Normal Monsoon","Drought Conditions","Excess Rainfall","Heatwave","Cold Wave","Ideal Conditions"];

/* ─── Config Maps ────────────────────────── */
const demandColor = { High: "#16a34a", Medium: "#d97706", Low: "#dc2626" };
const demandBg   = { High: "bg-green-100", Medium: "bg-yellow-100", Low: "bg-red-100" };
const demandText = { High: "text-green-700", Medium: "text-yellow-700", Low: "text-red-700" };
const demandIcon = { High: FaArrowUp, Medium: FaMinus, Low: FaArrowDown };

const riskColor  = { Low: "text-green-600", Medium: "text-yellow-600", High: "text-red-600" };
const riskBg     = { Low: "bg-green-50", Medium: "bg-yellow-50", High: "bg-red-50" };

const trendColor = { Rising: "#16a34a", Stable: "#2563eb", Declining: "#dc2626" };
const trendIcon  = { Rising: FaArrowUp, Stable: FaMinus, Declining: FaArrowDown };

/* ─── AI Typing Loader ───────────────────── */
const AI_MESSAGES = [
  "Connecting to agricultural market databases...",
  "Analyzing APMC mandi price trends...",
  "Consulting MSP and procurement data...",
  "Evaluating seasonal demand patterns...",
  "Cross-referencing state-wise price variations...",
  "Applying AI market intelligence model...",
  "Generating risk and profitability analysis...",
  "Finalizing prediction report...",
];

function LoadingState() {
  const [msgIdx, setMsgIdx] = useState(0);
  useState(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % AI_MESSAGES.length), 1200);
    return () => clearInterval(t);
  });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-4 py-8"
    >
      {/* Animated orb */}
      <div className="relative w-20 h-20">
        <span className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
        <span className="absolute inset-2 rounded-full bg-green-500/30 animate-ping [animation-delay:300ms]" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center shadow-lg">
          <FaRobot className="text-white text-2xl" />
        </div>
      </div>
      <p className="text-green-700 font-semibold text-sm animate-pulse">{AI_MESSAGES[msgIdx]}</p>
    </motion.div>
  );
}

/* ─── Custom Tooltip ─────────────────────── */
function PriceTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl">
      <p className="font-semibold text-green-400">{label}</p>
      <p>₹{payload[0]?.value?.toLocaleString("en-IN")}/qtl</p>
    </div>
  );
}

/* ─── Main Component ─────────────────────── */
export default function PricePredictor() {
  const [form, setForm] = useState({ crop: "", state: "", season: "", soilType: "", weather: "", quantity: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const predict = async () => {
    if (!form.crop || !form.state || !form.season) {
      toast.error("Please fill Crop, State and Season fields.");
      return;
    }
    setResult(null); setError(null); setLoading(true);
    try {
      const res = await API.post("/predict/price", form);
      setResult(res.data);
      toast.success("✅ AI Analysis Complete!");
    } catch (err) {
      const msg = err.response?.data?.error || "Prediction failed. Please try again.";
      setError(msg);
      toast.error("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const TrendIcon = result?.marketTrend ? trendIcon[result.marketTrend] : FaMinus;
  const DemandIcon = result?.demand ? demandIcon[result.demand] : FaMinus;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d2137] to-[#071a2e] py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 font-semibold text-xs px-5 py-2 rounded-full mb-5 backdrop-blur-sm">
            <FaRobot className="animate-pulse" /> GEMINI AI · Agricultural Intelligence Engine
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-3 leading-tight">
            🌾 Smart Price <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Predictor</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Real-time AI-powered crop price predictions using live Indian market intelligence
          </p>
        </motion.div>

        {/* ── Input Panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-6 shadow-2xl"
        >
          <h2 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
            <FaLeaf className="text-green-400" /> Enter Crop Details
            <span className="ml-auto text-xs text-gray-500 font-normal">Fields marked * are required</span>
          </h2>

          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            {[
              { key: "crop", label: "Crop Name *", options: CROPS, placeholder: "Select Crop" },
              { key: "state", label: "State *", options: STATES, placeholder: "Select State" },
              { key: "season", label: "Season *", options: SEASONS, placeholder: "Select Season" },
            ].map(({ key, label, options, placeholder }) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">{label}</label>
                <select value={form[key]} onChange={set(key)} className={selCls}>
                  <option value="">{placeholder}</option>
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { key: "soilType", label: "Soil Type (optional)", options: SOILS, placeholder: "Select Soil" },
              { key: "weather", label: "Weather Conditions (optional)", options: WEATHERS, placeholder: "Select Weather" },
            ].map(({ key, label, options, placeholder }) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">{label}</label>
                <select value={form[key]} onChange={set(key)} className={selCls}>
                  <option value="">{placeholder}</option>
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400">Quantity (quintals)</label>
              <input
                type="number" min="1" value={form.quantity} onChange={set("quantity")}
                placeholder="e.g. 50"
                className={selCls}
              />
            </div>
          </div>

          <button
            onClick={predict}
            disabled={loading || !form.crop || !form.state || !form.season}
            className={`w-full py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg ${
              loading || !form.crop || !form.state || !form.season
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 hover:shadow-green-500/25 hover:shadow-2xl hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
              <><span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> AI Analyzing Market Data...</>
            ) : (
              <><FaRobot /> Run AI Prediction</>
            )}
          </button>
        </motion.div>

        {/* ── Loading ── */}
        {loading && <LoadingState />}

        {/* ── Error ── */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 mb-6">
            <p className="text-red-400 font-bold flex items-center gap-2"><FaExclamationTriangle /> Prediction Failed</p>
            <p className="text-red-300 text-sm mt-1">{error}</p>
          </motion.div>
        )}

        {/* ── Results ── */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Price Hero */}
              <div className="relative overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl">
                {/* Glow effect */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-300/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-300/20 rounded-full blur-3xl" />

                <div className="relative grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-300 text-xs font-semibold uppercase tracking-widest">Gemini AI Predicted Price</span>
                      {result.source === "gemini" && (
                        <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold">LIVE AI</span>
                      )}
                    </div>
                    <p className="text-6xl md:text-7xl font-extrabold mb-1">
                      ₹{result.predictedPrice?.toLocaleString("en-IN")}
                    </p>
                    <p className="text-green-300 text-base">per quintal</p>
                    {result.priceRange && (
                      <p className="text-green-200 text-sm mt-2">
                        Market Range: ₹{result.priceRange.min?.toLocaleString("en-IN")} – ₹{result.priceRange.max?.toLocaleString("en-IN")}
                      </p>
                    )}
                    {result.mspPrice && (
                      <p className="text-yellow-300 text-xs mt-1">MSP Floor: ₹{result.mspPrice?.toLocaleString("en-IN")}/qtl</p>
                    )}
                  </div>

                  {/* Confidence + Profitability */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-green-200">AI Confidence</span>
                        <span className="font-bold text-white">{result.confidence || 85}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-green-300 to-white rounded-full"
                          initial={{ width: 0 }} animate={{ width: `${result.confidence || 85}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    {result.profitabilityScore && (
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-green-200">Profitability Score</span>
                          <span className="font-bold text-white">{result.profitabilityScore}/100</span>
                        </div>
                        <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full"
                            initial={{ width: 0 }} animate={{ width: `${result.profitabilityScore}%` }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <TrendIcon className="text-sm" style={{ color: trendColor[result.marketTrend] || "#fff" }} />
                      <span className="text-white font-semibold text-sm">{result.marketTrend || "Stable"} Trend</span>
                      {result.trendReason && (
                        <span className="text-green-200 text-xs">— {result.trendReason}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Insight Cards Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Market Demand", value: result.demand, Icon: DemandIcon, bg: demandBg[result.demand], color: demandText[result.demand] },
                  { label: "Risk Level", value: result.riskLevel, Icon: FaShieldAlt, bg: riskBg[result.riskLevel], color: riskColor[result.riskLevel] },
                  { label: "Weather Fit", value: result.weatherSuitability, Icon: FaCheckCircle, bg: "bg-blue-50", color: "text-blue-700" },
                  { label: "Export Potential", value: result.exportPotential || "Medium", Icon: FaGlobe, bg: "bg-purple-50", color: "text-purple-700" },
                ].map((card, i) => (
                  <motion.div
                    key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.08 * i }}
                    className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5"
                  >
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">{card.label}</p>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.bg}`}>
                        <card.Icon className={`text-base ${card.color}`} />
                      </div>
                      <p className="text-white font-bold text-lg">{card.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Best Sell Time + Action */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">⏰ Best Selling Time</p>
                  <p className="text-white font-bold text-lg">{result.bestSellTime}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">📍 Spread Risk</p>
                  <p className="text-white font-bold text-lg">{result.spreadRisk || result.riskLevel || "Medium"}</p>
                </div>
              </div>

              {/* Risk Analysis */}
              {result.riskAnalysis && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5">
                  <h4 className="text-amber-400 font-bold flex items-center gap-2 mb-2">
                    <FaExclamationTriangle /> Risk Analysis
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{result.riskAnalysis}</p>
                </div>
              )}

              {/* Suggested Action */}
              {result.suggestedAction && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5">
                  <h4 className="text-green-400 font-bold flex items-center gap-2 mb-2">
                    <FaLightbulb /> 🤖 AI Recommended Action
                  </h4>
                  <p className="text-gray-200 leading-relaxed">{result.suggestedAction}</p>
                </div>
              )}

              {/* Nearby Mandis */}
              {result.nearbyMandis?.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                    <FaStar className="text-yellow-400" /> Recommended Mandis
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.nearbyMandis.map((m, i) => (
                      <span key={i} className="bg-white/10 border border-white/20 text-gray-200 text-sm px-3 py-1.5 rounded-full">{m}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Trend Chart */}
              {result.trendData?.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-5 flex items-center gap-2">
                    <FaChartBar className="text-green-400" /> 6-Month Price Trend (₹/quintal)
                  </h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={result.trendData}>
                      <defs>
                        <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                      <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                      <Tooltip content={<PriceTooltip />} />
                      {result.mspPrice && <ReferenceLine y={result.mspPrice} stroke="#fbbf24" strokeDasharray="4 4" label={{ value: "MSP", fill: "#fbbf24", fontSize: 11 }} />}
                      <Area type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={2.5} fill="url(#priceGrad)" dot={{ r: 4, fill: "#16a34a", strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Monthly Demand */}
              {result.monthlyDemand?.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-5">Monthly Demand Forecast Index</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={result.monthlyDemand} barSize={28}>
                      <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                      <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} domain={[0, 100]} />
                      <Tooltip formatter={(v) => [`${v}%`, "Demand Index"]} contentStyle={{ background: "#111827", border: "none", borderRadius: 10 }} labelStyle={{ color: "#9ca3af" }} />
                      <Bar dataKey="demand" fill="#34d399" radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <p className="text-center text-gray-600 text-xs">
                ⚡ Powered by Gemini AI · Farm2Gov Agricultural Intelligence · Results for educational purpose
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const selCls = "w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-white bg-white/5 backdrop-blur-sm placeholder-gray-500";
