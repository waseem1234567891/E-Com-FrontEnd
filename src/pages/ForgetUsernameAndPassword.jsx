import { useState } from "react";
import AuthService from "../services/AuthService";

const ForgetUsernameAndPassword = () => {
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState("username"); // or "password"
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "username") {
        await AuthService.forgotUsername(email);
        setMessage("✅ If this email exists, your username has been sent.");
      } else {
        await AuthService.forgotPassword(email);
        setMessage("✅ If this email exists, a reset link has been sent.");
      }
    } catch (err) {
      setMessage("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-gray-100 to-white px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {mode === "username" ? "Forgot Username" : "Forgot Password"}
        </h2>

        {/* Toggle Mode */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("username");
              setMessage("");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium shadow 
              ${mode === "username" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}
            `}
          >
            Forgot Username
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("password");
              setMessage("");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium shadow 
              ${mode === "password" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}
            `}
          >
            Forgot Password
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registered Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium shadow"
          >
            {mode === "username" ? "Send Username" : "Send Reset Link"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgetUsernameAndPassword;
