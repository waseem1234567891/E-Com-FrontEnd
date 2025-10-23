import React from "react";

const AddressCard = ({ addresses, onEdit, onDelete, onAdd }) => (
  <div>
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-lg font-semibold text-gray-800">Saved Addresses</h3>
      <button
        onClick={onAdd}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-md shadow"
      >
        + Add Address
      </button>
    </div>

    {addresses?.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr, idx) => (
          <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
            <div className="text-gray-700 space-y-1">
              <p>{addr.street}, {addr.city}</p>
              <p>{addr.state} {addr.postalCode}</p>
              <p>{addr.country}</p>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onEdit(addr)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded-md"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(addr)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-600">No addresses saved.</p>
    )}
  </div>
);

export default AddressCard;
