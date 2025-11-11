import React from "react";

const Filters = ({ filters, setFilters, data }) => {
  const uniqueValues = (key) =>
    [...new Set(data.map((item) => item[key]).filter(Boolean))];

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {Object.keys(filters).map((key) => (
        <select
          key={key}
          name={key}
          value={filters[key]}
          onChange={handleChange}
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
