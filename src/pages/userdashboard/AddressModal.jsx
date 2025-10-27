import React from "react";

const AddressModal = ({ show, onClose, onSave, addressForm, setAddressForm, editingAddress }) => {
  if (!show) return null;

  // ✅ Added "houseNumber" as the first field
  const fields = ["houseNumber", "street", "city", "state", "postalCode", "country"];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {editingAddress ? "Edit Address" : "Add Address"}
        </h3>

        {fields.map((field) => (
          <div key={field} className="flex flex-col mb-2">
            <label className="text-sm font-medium text-gray-700 mb-1">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              placeholder={field}
              value={addressForm[field] || ""}
              onChange={(e) =>
                setAddressForm({ ...addressForm, [field]: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-md text-sm"
            />
          </div>
        ))}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
