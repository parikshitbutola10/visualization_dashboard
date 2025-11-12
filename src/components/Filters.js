import React from "react";

const Filters = ({ filters, setFilters, data }) => {
  // ✅ Prevents crash if data is not an array
  const uniqueValues = (key) =>
    Array.isArray(data)
      ? [...new Set(data.map((item) => item[key]).filter(Boolean))]
      : [];

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="filters-container flex flex-wrap gap-4 p-4 
                 bg-white dark:bg-gray-800 rounded-xl shadow-lg justify-center"
    >
      {Object.keys(filters).map((key) => (
        <select
          key={key}
          name={key}
          value={filters[key]}
          onChange={handleChange}
          className="filter-select px-4 py-2 font-semibold 
                     rounded-lg border border-gray-300 dark:border-gray-700 
                     bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 
                     shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500 
                     transition-all duration-200"
        >
          <option value="">All {key}</option>
          {uniqueValues(key).map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
};

export default Filters;
