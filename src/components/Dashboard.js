import React, { useEffect, useState } from "react";
import axios from "axios";
import Filters from "./Filters";
import Navbar from "./Navbar";
import IntensityChart from "./Charts/IntensityChart";
import LikelihoodChart from "./Charts/LikelihoodChart";
import RelevanceChart from "./Charts/RelevanceChart";
import YearlyTrendChart from "./Charts/YearlyTrendChart";
import CountryDistributionChart from "./Charts/CountryDistributionChart";
import "../App.css";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [filters, setFilters] = useState({
    end_year: "",
    topic: "",
    sector: "",
    region: "",
    pestle: "",
    source: "",
    swot: "",
    country: "",
    city: ""
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/items")
      .then(res => {
        setData(res.data);
        setFiltered(res.data);
      })
      .catch(err => console.error("API Fetch Error:", err));
  }, []);

  useEffect(() => {
    let filteredData = data;
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        filteredData = filteredData.filter(item =>
          item[key]?.toLowerCase().includes(filters[key].toLowerCase())
        );
      }
    });
    setFiltered(filteredData);
  }, [filters, data]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <div className="dashboard-container">
        <Filters filters={filters} setFilters={setFilters} data={data} />

        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-title">Intensity by Topic</div>
            <IntensityChart data={filtered} />
          </div>
          <div className="chart-card">
            <div className="chart-title">Likelihood by Region</div>
            <LikelihoodChart data={filtered} />
          </div>
          <div className="chart-card">
            <div className="chart-title">Relevance by Sector</div>
            <RelevanceChart data={filtered} />
          </div>
          <div className="chart-card">
            <div className="chart-title">Yearly Trend (Intensity)</div>
            <YearlyTrendChart data={filtered} />
          </div>
          <div className="chart-card">
            <div className="chart-title">Country Distribution</div>
            <CountryDistributionChart data={filtered} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
