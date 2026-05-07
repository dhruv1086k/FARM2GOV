// client/src/pages/Home.jsx
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaLeaf,
  FaRobot,
  FaFileAlt,
  FaShoppingCart,
  FaMicrophone,
  FaBug,
  FaCloudSun,
  FaArrowRight,
  FaStar,
  FaUsers,
  FaSeedling,
  FaChartLine,
} from "react-icons/fa";
import heroImg from "../assets/hero.png";
import crop from "../assets/cropImg.png";
import farmer from "../assets/famerImg.png";
import cropAd from "../assets/cropAdvisorImg.png";
import policy from "../assets/policyImg.png";
import wheatImg from "../assets/wheat.png";
import riceImg from "../assets/rice.png";
import maizeImg from "../assets/maize.png";

/* ─── Animation Variants ─────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ─── Stats Data ────────────────────────────── */
const stats = [
  { icon: FaUsers, label: "Registered Farmers", value: "12,000+", color: "text-green-600" },
  { icon: FaSeedling, label: "Crops Listed", value: "45,000+", color: "text-emerald-600" },
  { icon: FaFileAlt, label: "Govt Policies", value: "300+", color: "text-teal-600" },
  { icon: FaChartLine, label: "AI Predictions", value: "1.2L+", color: "text-green-700" },
];

/* ─── Features Data ─────────────────────────── */
const features = [
  {
    icon: FaShoppingCart,
    title: "Crop Marketplace",
    desc: "List your produce and connect directly with buyers. Set your own price, no middlemen.",
    href: "/marketplace",
    color: "bg-green-50 text-green-700",
    border: "border-green-200",
  },
  {
    icon: FaRobot,
    title: "AI Price Predictor",
    desc: "Get AI-powered price predictions based on crop, state, and season with confidence scores.",
    href: "/predict",
    color: "bg-emerald-50 text-emerald-700",
    border: "border-emerald-200",
  },
  {
    icon: FaFileAlt,
    title: "Government Policies",
    desc: "Stay updated with the latest government schemes, subsidies, and agricultural policies.",
    href: "/policies",
    color: "bg-teal-50 text-teal-700",
    border: "border-teal-200",
  },
  {
    icon: FaMicrophone,
    title: "Voice Assistant",
    desc: "Ask questions in your language using our AI-powered voice assistant for instant answers.",
    href: "/voice-assistant",
    color: "bg-lime-50 text-lime-700",
    border: "border-lime-200",
  },
  {
    icon: FaBug,
    title: "Disease Detection",
    desc: "Upload a photo of your crop and get instant disease diagnosis with treatment advice.",
    href: "/disease-detect",
    color: "bg-orange-50 text-orange-700",
    border: "border-orange-200",
  },
  {
    icon: FaCloudSun,
    title: "Weather Widget",
    desc: "Real-time weather data for your state — temperature, humidity, rain probability.",
    href: "/farmer/dashboard",
    color: "bg-sky-50 text-sky-700",
    border: "border-sky-200",
  },
];

/* ─── Testimonials ──────────────────────────── */
const testimonials = [
  {
    name: "Rajesh Kumar",
    state: "Punjab",
    text: "Farm2Gov helped me sell my wheat directly at ₹2,400/quintal. No middlemen, pure profit.",
    rating: 5,
    crop: "Wheat Farmer",
  },
  {
    name: "Priya Devi",
    state: "Maharashtra",
    text: "The AI price predictor is amazing. I now know the best time to sell my tomatoes.",
    rating: 5,
    crop: "Vegetable Farmer",
  },
  {
    name: "Mohammed Salim",
    state: "West Bengal",
    text: "Government policies section saved me ₹50,000 in subsidies I didn't know I qualified for.",
    rating: 5,
    crop: "Rice Farmer",
  },
];

export default function Home() {
  return (
    <div className="w-full bg-[#F6FAF6] overflow-x-hidden">

      {/* ─── HERO SECTION ──────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl -z-0 pointer-events-none" />

        <motion.div
          className="relative z-10"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full mb-5">
              <FaLeaf className="text-green-600" />
              Smart Agriculture Platform
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-6xl font-extrabold text-green-900 leading-tight tracking-tight"
          >
            Empowering Farmers,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
              Directly to Government
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-gray-600 mt-5 text-lg leading-relaxed max-w-lg"
          >
            Sell your crops directly, get AI-powered price predictions, detect diseases early,
            and stay updated with the latest government policies — all in one platform.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mt-8">
            <Link
              to="/farmer/signup"
              className="flex items-center gap-2 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-green-300/50 transition-all duration-300"
            >
              Get Started Free
              <FaArrowRight className="text-sm" />
            </Link>
            <Link
              to="/marketplace"
              className="flex items-center gap-2 bg-white border border-green-300 text-green-700 hover:bg-green-50 px-8 py-3.5 rounded-xl font-semibold shadow hover:shadow-md transition-all duration-300"
            >
              <FaShoppingCart className="text-sm" />
              Explore Marketplace
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative z-10 flex justify-center"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          <img
            src={heroImg}
            alt="Farm2Gov Platform"
            className="w-full max-w-md drop-shadow-xl"
          />
        </motion.div>
      </section>

      {/* ─── STATS SECTION ─────────────────────────── */}
      <section className="bg-gradient-to-r from-green-700 to-green-600 py-14">
        <motion.div
          className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="text-center text-white"
            >
              <s.icon className="text-4xl mx-auto mb-3 text-green-200" />
              <p className="text-3xl font-extrabold">{s.value}</p>
              <p className="text-green-200 text-sm mt-1">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── FEATURES SECTION ──────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
            Everything You Need
          </span>
          <h2 className="text-4xl font-extrabold text-green-900 mt-3">
            Farmer Services
          </h2>
          <p className="text-gray-600 mt-3 max-w-xl mx-auto">
            A complete digital ecosystem designed to transform the lives of Indian farmers.
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {features.map((f, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Link
                to={f.href}
                className={`group block bg-white border ${f.border} p-7 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300`}
              >
                <div
                  className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  <f.icon className="text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                <span className="inline-flex items-center gap-1 mt-5 text-green-700 font-semibold text-sm group-hover:gap-2 transition-all">
                  Explore <FaArrowRight className="text-xs" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── CROP LISTINGS PREVIEW ─────────────────── */}
      <section className="bg-green-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="flex items-center justify-between mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div>
              <h2 className="text-3xl font-extrabold text-green-900">
                Fresh Crop Listings
              </h2>
              <p className="text-gray-600 mt-1">
                Browse directly from farmers across India.
              </p>
            </div>
            <Link
              to="/marketplace"
              className="hidden md:flex items-center gap-2 text-green-700 font-semibold hover:underline"
            >
              View All <FaArrowRight />
            </Link>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <CropCard
              img={wheatImg}
              name="Wheat"
              qty="500 quintal"
              location="Amritsar, Punjab"
              price="₹2,400/quintal"
              category="Cereals"
              status="Available"
              farmer="Rajesh Kumar"
            />
            <CropCard
              img={riceImg}
              name="Basmati Rice"
              qty="300 quintal"
              location="Murshidabad, West Bengal"
              price="₹3,800/quintal"
              category="Cereals"
              status="Available"
              farmer="Priya Devi"
            />
            <CropCard
              img={maizeImg}
              name="Maize"
              qty="200 quintal"
              location="Dharwad, Karnataka"
              price="₹1,600/quintal"
              category="Cereals"
              status="Under Review"
              farmer="Mohammed Salim"
            />
          </motion.div>

          <div className="text-center mt-8 md:hidden">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 text-green-700 font-semibold"
            >
              View All Listings <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="text-4xl font-extrabold text-green-900">How It Works</h2>
          <p className="text-gray-600 mt-3">
            Getting started is simple. Be market-ready in minutes.
          </p>
        </motion.div>
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {[
            { step: "01", title: "Register as Farmer", desc: "Create your account with basic details. Takes less than 2 minutes.", icon: "👨‍🌾" },
            { step: "02", title: "List Your Crops", desc: "Add your crop details, set your price, and reach thousands of buyers.", icon: "🌾" },
            { step: "03", title: "Sell & Earn", desc: "Get connected directly with government buyers and private purchasers.", icon: "💰" },
          ].map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-white border border-green-100 rounded-2xl p-8 shadow-sm text-center hover:shadow-lg transition"
            >
              <div className="text-5xl mb-4">{s.icon}</div>
              <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                STEP {s.step}
              </span>
              <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────── */}
      <section className="bg-gradient-to-br from-green-700 to-green-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-4xl font-extrabold text-white">
              Trusted by Farmers Across India
            </h2>
            <p className="text-green-200 mt-3">
              Real stories from real farmers who transformed their income.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-7 hover:bg-white/15 transition"
              >
                <div className="flex text-yellow-400 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <FaStar key={j} className="text-sm" />
                  ))}
                </div>
                <p className="text-white/90 text-sm leading-relaxed italic">
                  "{t.text}"
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center text-white font-bold text-lg">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-green-300 text-xs">
                      {t.crop} • {t.state}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA BANNER ────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.div
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-center shadow-2xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
            Join 12,000+ farmers who are already using Farm2Gov to earn more and work smarter.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/farmer/signup"
              className="bg-white text-green-700 font-bold px-8 py-3.5 rounded-xl hover:bg-green-50 shadow-lg transition"
            >
              Register Now — It's Free
            </Link>
            <Link
              to="/predict"
              className="border border-white text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition"
            >
              Try AI Predictor
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

/* ─── Crop Card Component ──────────────────── */
function CropCard({ img, name, qty, location, price, category, status, farmer }) {
  const statusColors = {
    Available: "bg-green-100 text-green-700",
    "Under Review": "bg-yellow-100 text-yellow-700",
    Sold: "bg-red-100 text-red-700",
  };

  return (
    <motion.div
      variants={fadeUp}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-green-100"
    >
      <div className="relative">
        <img src={img} className="w-full h-48 object-cover" alt={name} />
        <span className="absolute top-3 left-3 px-3 py-1 bg-green-700/80 text-white text-xs font-semibold rounded-full">
          {category}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{name}</h3>
            <p className="text-gray-500 text-sm mt-0.5">By {farmer}</p>
          </div>
          <span className="text-xl font-extrabold text-green-700">{price}</span>
        </div>

        <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm">
          <span>📦 {qty}</span>
          <span className="mx-1">•</span>
          <span>📍 {location}</span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status] || "bg-gray-100 text-gray-700"}`}>
            {status}
          </span>
          <Link
            to="/marketplace"
            className="bg-green-700 hover:bg-green-800 text-white text-sm px-4 py-2 rounded-xl font-semibold transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
