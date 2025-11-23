import riceImg from "../assets/rice.png"

export default function Footer() {
    return (
        <footer className="bg-[#FAF9F1] text-gray-700 py-12 mt-20 border-t border-gray-300">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">

                {/* About */}
                <div>
                    <h3 className="text-xl font-semibold text-green-900">About Farm2Gov</h3>
                    <p className="mt-4 leading-relaxed text-sm text-gray-600">
                        Farm2Gov is a streamlined platform enabling farmers to connect directly
                        with government services. Farmers can access crop advisory, sell produce,
                        view policies, and stay informed—all in one place.
                    </p>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-xl font-semibold text-green-900">Contact Us</h3>

                    <div className="mt-4 space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                            <span className="text-green-700 text-lg">📧</span>
                            <p>support@farm2gov.in</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-green-700 text-lg">📞</span>
                            <p>+91 1254-567-630</p>
                        </div>
                    </div>
                </div>

                {/* Social */}
                <div className="rounded-2xl overflow-hidden">
                    <img src={riceImg} alt="" />
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="mt-10 border-t pt-6 text-center text-sm text-gray-600">
                © {new Date().getFullYear()} Farm2Gov — All rights reserved
            </div>
        </footer>
    );
}
