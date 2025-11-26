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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 px-6 py-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-green-800 tracking-tight">
          Welcome, {profile?.name}! 👨‍🌾
        </h1>
        <p className="text-gray-700 mt-2 text-lg">
          Your personalized farmer dashboard overview.
        </p>
      </div>

      {/* Profile Card */}
      <div className="mt-10 bg-white/90 backdrop-blur-lg border border-green-100 shadow-xl rounded-3xl max-w-3xl mx-auto p-10">
        <h2 className="text-2xl font-bold text-green-900 mb-6">Your Profile</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
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

      {/* Crop Listings */}
      <div className="mt-14">
        <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">
          Your Crop Listings
        </h2>

        {profile.crops.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-lg border border-green-100 shadow-md p-8 rounded-2xl text-center text-gray-600 max-w-lg mx-auto">
            You haven't added any crops yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            {profile.crops.map((crop, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-lg border border-green-100 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all"
              >
                <h3 className="text-xl font-semibold text-green-800">
                  {crop.name}
                </h3>

                <p className="text-gray-700 mt-2 font-medium">
                  {crop.quantity} kg
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Location: {crop.location}
                </p>

                <span className="inline-block mt-4 px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {crop.status || "Available"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-16 flex flex-wrap justify-center gap-5">
        <button className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition font-semibold">
          Add New Crop
        </button>

        <button className="bg-white border border-green-700 text-green-700 hover:bg-green-50 px-8 py-3 rounded-xl shadow-md transition font-semibold">
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
