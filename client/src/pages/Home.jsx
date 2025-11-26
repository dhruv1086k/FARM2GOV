import heroImg from "../assets/hero.png";
import crop from "../assets/cropImg.png";
import farmer from "../assets/famerImg.png";
import cropAd from "../assets/cropAdvisorImg.png";
import policy from "../assets/policyImg.png";
import wheatImg from "../assets/wheat.png";
import riceImg from "../assets/rice.png";
import maizeImg from "../assets/maize.png";

export default function Home() {
  return (
    <div className="w-full bg-[#FAF9F6]">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 leading-tight">
            Empowering Farmers, <br />
            Connecting Directly to Government
          </h1>

          <p className="text-gray-600 mt-4 text-lg">
            Sell your crops directly, get AI crop advice, and stay updated with
            the latest policies — all in your language.
          </p>

          <div className="flex gap-4 mt-6">
            <a href="/farmer/signup">
              <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-medium cursor-pointer">
                Register as Farmer
              </button>
            </a>

            <a href="/farmer/login">
              <button className="border border-gray-400 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium cursor-pointer">
                Login as Farmer
              </button>
            </a>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <img
            src={heroImg}
            alt="Farmers illustration"
            className="w-96 md:w-96"
          />
        </div>
      </section>

      {/* Modules Title */}
      <h2 className="text-3xl font-bold text-center text-green-900 mt-10">
        Farmer Services
      </h2>

      {/* Modules Section */}
      <section className="max-w-7xl mx-auto px-6 mt-8 grid md:grid-cols-4 gap-6">
        {/* Module Card */}
        <a href="/farmer/login">
          <ModuleCard icon={farmer} title="Register/Login" />
        </a>

        <ModuleCard icon={crop} title="Crop Selling" />

        <a href="/predict">
          <ModuleCard icon={cropAd} title="Crop Advisor (AI)" />
        </a>
        <a href="/policies">
          <ModuleCard icon={policy} title="Government Policies" />
        </a>
      </section>

      {/* Crop Listings Title */}
      <h2 className="text-3xl font-bold text-center text-green-900 mt-16">
        Crop Listings
      </h2>

      {/* Crop Cards */}
      <section className="max-w-7xl mx-auto px-6 mt-8 grid md:grid-cols-3 gap-6">
        <CropCard
          img={wheatImg}
          name="Wheat"
          qty="500 kg"
          location="Haryana, India"
          status="Available"
          statusColor="bg-green-100 text-green-700"
        />

        <CropCard
          img={riceImg}
          name="Rice"
          qty="1000 kg"
          location="West Bengal, India"
          status="Available"
          statusColor="bg-green-100 text-green-700"
        />

        <CropCard
          img={maizeImg}
          name="Maize"
          qty="200 kg"
          location="Karnataka, India"
          status="Under Review"
          statusColor="bg-yellow-100 text-yellow-700"
        />
      </section>

      {/* Latest Updates Section */}
      <section className="max-w-7xl mx-auto px-6 mt-16 mb-20">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-green-900">
            # Latest Updates
          </h3>
          <button className="text-green-800 text-lg">→</button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <UpdateCard name="Wheat" qty="500 kg" />

          <UpdateCard name="Rice" qty="1000 kg" badge="Available" />

          <UpdateCard
            name="Maize"
            qty="200 kg"
            badge="Under Process"
            badgeColor="bg-yellow-200 text-yellow-700"
          />
        </div>
      </section>
    </div>
  );
}

/* Reusable Components */

function ModuleCard({ icon, title }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
      <img src={icon} alt="" className="w-12 mx-auto" />
      <h3 className="text-lg font-semibold text-center mt-4">{title}</h3>
      <button className="w-full bg-green-700 cursor-pointer hover:bg-green-800 text-white py-2 mt-4 rounded-lg">
        Explore
      </button>
    </div>
  );
}

function CropCard({ img, name, qty, location, status, statusColor }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
      <img src={img} className="w-full h-40 object-cover rounded-lg" />

      <h3 className="text-xl font-semibold mt-4">{name}</h3>
      <p className="text-gray-600 text-sm">{qty}</p>
      <p className="text-gray-500 text-sm">{location}</p>

      <div className="flex items-center justify-between mt-4">
        <span
          className={`px-3 py-1 rounded-lg text-sm font-medium ${statusColor}`}
        >
          {status}
        </span>
        <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg">
          Buy
        </button>
      </div>
    </div>
  );
}

function UpdateCard({
  name,
  qty,
  badge,
  badgeColor = "bg-green-100 text-green-700",
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-600 text-sm">{qty}</p>

      {badge && (
        <span
          className={`inline-block mt-2 px-3 py-1 rounded-lg text-sm font-medium ${badgeColor}`}
        >
          {badge}
        </span>
      )}
    </div>
  );
}
