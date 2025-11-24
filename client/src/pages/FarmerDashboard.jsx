import { useEffect, useState } from "react";
import API from "../api/axios";

export default function FarmerDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/farmers/me")
      .then((res) => setProfile(res.data))
      .catch((err) => {
        if (err.response?.status === 403) {
          alert("Your account is deactivated. Logging out...");
          localStorage.removeItem("token");
          window.location.href = "/farmer/login";
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6EE] px-6 py-10">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-green-800">
        Welcome, {profile?.name}! 👨‍🌾
      </h1>
      <p className="text-gray-600 mt-2">
        Here is your farmer dashboard overview.
      </p>

      {/* Profile Card */}
      <div className="mt-8 bg-white shadow-lg rounded-2xl p-6 max-w-2xl">
        <h2 className="text-2xl font-bold text-green-900 mb-4">Your Profile</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <ProfileRow label="Full Name" value={profile.name} />
          <ProfileRow label="Phone Number" value={profile.phone} />
          <ProfileRow label="Email" value={profile.email} />
          <ProfileRow label="State" value={profile.state} />
          <ProfileRow label="Language" value={profile.language} />
          <ProfileRow
            label="Account Created"
            value={new Date(profile.createdAt).toLocaleDateString()}
          />
        </div>
      </div>

      {/* Crops */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-green-900 mb-4">
          Your Crop Listings
        </h2>

        {profile.crops.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-gray-600">
            You haven't added any crops yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {profile.crops.map((crop, index) => (
              <div key={index} className="bg-white p-4 shadow rounded-xl">
                <h3 className="text-xl font-semibold text-green-800">
                  {crop.name}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{crop.quantity} kg</p>
                <p className="text-gray-500 text-sm">{crop.location}</p>
                <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {crop.status || "Available"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-12 flex gap-4">
        <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-medium">
          Add New Crop
        </button>

        <button className="bg-white border border-green-700 text-green-700 hover:bg-green-50 px-6 py-3 rounded-lg font-medium">
          Edit Profile
        </button>
      </div>
    </div>
  );
}

/* Small reusable row component */
function ProfileRow({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-medium">{value}</p>
    </div>
  );
}
