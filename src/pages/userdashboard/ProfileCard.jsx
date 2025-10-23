import React from "react";

const ProfileCard = ({ profileForm, user, setProfileForm, onSave }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
    <h2 className="text-2xl font-semibold text-gray-700">Your Profile</h2>

    {/* Username (read-only) */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Username</label>
      <input
        type="text"
        value={profileForm.userName}
        disabled
        className="w-full border px-3 py-2 rounded-md text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
      />
    </div>

    {/* First & Last Name */}
    {["firstName", "lastName"].map((field) => (
      <div key={field} className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          {field === "firstName" ? "First Name" : "Last Name"}
        </label>
        <input
          type="text"
          value={profileForm[field]}
          onChange={(e) => setProfileForm({ ...profileForm, [field]: e.target.value })}
          className="w-full border px-3 py-2 rounded-md text-sm"
        />
      </div>
    ))}

    {/* Email (read-only) */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Email Address</label>
      <input
        type="text"
        value={user?.email || ""}
        disabled
        className="w-full border px-3 py-2 rounded-md text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
      />
    </div>

    <button
      onClick={onSave}
      className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm"
    >
      Save Profile
    </button>
  </div>
);

export default ProfileCard;
