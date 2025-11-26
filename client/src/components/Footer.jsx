import riceImg from "../assets/rice.png";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-green-50 to-green-100 text-gray-700 py-14 border-t border-green-200">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
        {/* About */}
        <div>
          <img
            src={logo}
            alt="Farm2Gov Logo"
            className="h-24 w-auto object-contain mb-4"
          />

          <p className="text-sm text-gray-600 leading-relaxed">
            Farm2Gov bridges farmers directly with government services—
            providing crop advisory, policy updates, produce selling options,
            and essential tools all in one smart platform.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold text-green-900">Contact Us</h3>

          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-3 group">
              <span className="text-green-700 text-lg">📧</span>
              <p className="group-hover:text-green-800 transition">
                support@farm2gov.in
              </p>
            </div>

            <div className="flex items-center gap-3 group">
              <span className="text-green-700 text-lg">📞</span>
              <p className="group-hover:text-green-800 transition">
                +91 9305799191
              </p>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="rounded-3xl overflow-hidden shadow-xl bg-white/90 backdrop-blur-lg border border-green-100">
          <img
            src={riceImg}
            alt="Rice Illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-green-200 pt-6 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Farm2Gov • All rights reserved.
      </div>
    </footer>
  );
}
