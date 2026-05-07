// client/src/components/Footer.jsx
import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaStore,
  FaRobot,
  FaFileAlt,
  FaMicrophone,
  FaBug,
  FaShieldAlt,
} from "react-icons/fa";
import logo from "../assets/logo.png";

const quickLinks = [
  { to: "/marketplace", label: "Crop Marketplace", icon: FaStore },
  { to: "/predict", label: "AI Price Predictor", icon: FaRobot },
  { to: "/policies", label: "Government Policies", icon: FaFileAlt },
  { to: "/voice-assistant", label: "Voice Assistant", icon: FaMicrophone },
  { to: "/disease-detect", label: "Disease Detection", icon: FaBug },
  { to: "/farmer/signup", label: "Farmer Registration", icon: FaShieldAlt },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-green-900 to-green-950 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Column 1 — Brand */}
        <div>
          <img src={logo} alt="Farm2Gov" className="h-16 w-auto mb-5 brightness-110" />
          <p className="text-green-300 text-sm leading-relaxed">
            Farm2Gov is India's smart agriculture platform bridging farmers
            directly with government services, AI-powered advisory, and
            direct market access.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-4 mt-6">
            {[
              { Icon: FaTwitter, href: "#", label: "Twitter" },
              { Icon: FaInstagram, href: "#", label: "Instagram" },
              { Icon: FaLinkedin, href: "#", label: "LinkedIn" },
              { Icon: FaGithub, href: "#", label: "GitHub" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-green-600 flex items-center justify-center transition-all duration-200"
              >
                <Icon className="text-sm text-green-300 hover:text-white" />
              </a>
            ))}
          </div>
        </div>

        {/* Column 2 — Quick Links */}
        <div>
          <h4 className="font-bold text-white text-lg mb-5 flex items-center gap-2">
            <FaLeaf className="text-green-400 text-sm" />
            Quick Links
          </h4>
          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="flex items-center gap-2 text-green-300 hover:text-white text-sm transition group"
                >
                  <link.icon className="text-green-500 text-xs group-hover:text-green-400 transition" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Farmer Support */}
        <div>
          <h4 className="font-bold text-white text-lg mb-5">Farmer Support</h4>
          <ul className="space-y-3 text-sm text-green-300">
            {[
              "How to Register",
              "Add Crop Listing",
              "Government Schemes Guide",
              "AI Predictor Help",
              "Disease Detection Guide",
              "Contact Support",
            ].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-white transition"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4 — Contact */}
        <div>
          <h4 className="font-bold text-white text-lg mb-5">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-green-300">
              <FaEnvelope className="text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-white font-medium">Email</p>
                <a href="mailto:support@farm2gov.in" className="hover:text-white transition">
                  support@farm2gov.in
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3 text-sm text-green-300">
              <FaPhone className="text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-white font-medium">Helpline</p>
                <a href="tel:+919305799191" className="hover:text-white transition">
                  +91 93057 99191
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3 text-sm text-green-300">
              <FaMapMarkerAlt className="text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-white font-medium">Headquarters</p>
                <p>New Delhi, India — 110001</p>
              </div>
            </li>
          </ul>

          {/* Newsletter / CTA */}
          <div className="mt-6 bg-white/10 rounded-xl p-4 border border-white/10">
            <p className="text-white text-sm font-semibold mb-3">
              🌾 Stay Updated
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-green-400 outline-none focus:border-green-400 transition"
              />
              <button className="bg-green-600 hover:bg-green-500 text-white text-sm px-3 py-2 rounded-lg font-semibold transition">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-green-400">
          <p>
            © {new Date().getFullYear()} Farm2Gov · All rights reserved · Made with ❤️ for Indian Farmers
          </p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
