import React, { useState } from "react";
import { useLocalNotification } from "../../context/LocalNotificationContext";
import UserService from "../../services/UserService";

export default function AddAddressForm({ userId, token, onSave, onCancel }) {
  const [newAddress, setNewAddress] = useState({
    houseNumber: "",
    street: "",
    postalCode: "",
    country: "",
  });
  const [errors, setErrors] = useState({});
  const { showNotification } = useLocalNotification();

  const validate = () => {
    const errs = {};
    if (!newAddress.houseNumber.trim()) errs.houseNumber = "Required";
    if (!newAddress.street.trim()) errs.street = "Required";
    if (!newAddress.postalCode.trim()) errs.postalCode = "Required";
    if (!newAddress.country.trim()) errs.country = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      let savedAddress;

      // ✅ Logged-in user → call backend
      if (userId && token) {
        const res = await UserService.addAddress(userId, newAddress, token);
        savedAddress = res.data;
        showNotification("✅ Address added!", "success");
      } 
      // ✅ Guest → just local
      else {
        savedAddress = newAddress;
        showNotification("✅ Address set for checkout!", "success");
      }

      onSave(savedAddress);

      // Reset form and errors
      setNewAddress({ houseNumber: "", street: "", postalCode: "", country: "" });
      setErrors({});
    } catch (err) {
      console.error(err);
      showNotification("❌ Failed to save address!", "error");
    }
  };

  return (
    <div className="p-3 border rounded-md bg-gray-50 mt-3">
      <h4 className="font-semibold text-sm mb-2">Add Shipping Address</h4>

      {["houseNumber", "street", "postalCode", "country"].map((field) => (
        <div key={field} className="mb-2">
          <input
            className={`w-full border p-2 rounded ${
              errors[field] ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={field.replace(/([A-Z])/g, " $1")}
            value={newAddress[field]}
            onChange={(e) =>
              setNewAddress({ ...newAddress, [field]: e.target.value })
            }
          />
          {errors[field] && (
            <p className="text-red-600 text-xs mt-1">{errors[field]}</p>
          )}
        </div>
      ))}

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white w-full py-2 rounded mt-1"
      >
        {userId && token ? "Save Address" : "Set Address"}
      </button>

      {onCancel && (
        <button
          onClick={onCancel}
          className="text-gray-600 text-sm underline w-full mt-2"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
