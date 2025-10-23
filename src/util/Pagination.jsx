// Pagination.jsx
import React from "react";

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages === 0) return null;

  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 py-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          page === 0
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            p === page
              ? "bg-blue-600 text-white font-bold"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {p + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages - 1}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          page === totalPages - 1
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600 text-white"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
