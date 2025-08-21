import React, { useState } from "react";
import Chart from "./components/Chart";
import fuelData from "./data/Prices.json"; // <-- renamed import to fuelData for clarity

type FuelRecord = {
  city: string;
  fuel: string;
  date: string;
  price: number;
};

// Compute monthly averages
function getMonthlyAverages(
  dataset: FuelRecord[],
  city: string,
  fuel: string,
  year: string
): number[] {
  const monthly: { [key: number]: number[] } = {};

  dataset.forEach((d) => {
    const dt = new Date(d.date);
    if (
      d.city === city &&
      d.fuel === fuel &&
      dt.getFullYear().toString() === year
    ) {
      const month = dt.getMonth();
      if (!monthly[month]) monthly[month] = [];
      monthly[month].push(d.price || 0);
    }
  });

  return Array.from({ length: 12 }, (_, i) => {
    const prices = monthly[i] || [];
    return prices.length
      ? prices.reduce((a, b) => a + b, 0) / prices.length
      : 0;
  });
}

const App: React.FC = () => {
  const data: FuelRecord[] = fuelData as FuelRecord[]; // type assertion for JSON

  const cities = Array.from(new Set(data.map((d) => d.city)));
  const fuels = Array.from(new Set(data.map((d) => d.fuel)));
  const datasetYears = Array.from(
    new Set(data.map((d) => new Date(d.date).getFullYear().toString()))
  );

  // add 2023, 2024, 2025 also
  const years = Array.from(new Set([...datasetYears, "2023", "2024", "2025"]));

  // set safe defaults (if dataset is empty, fall back to first from list or "")
  const [city, setCity] = useState(cities[0] || "");
  const [fuel, setFuel] = useState(fuels[0] || "");
  const [year, setYear] = useState(years[0] || "");

  const monthlyData = getMonthlyAverages(data, city, fuel, year);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center" }}>Fuel RSP Dashboard</h2>

      {/* Center dropdowns */}
      <div
        style={{
          display: "flex",
          justifyContent: "center", // changed back to center
          gap: "1rem",
          marginBottom: "20px",
        }}
      >
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          {cities.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select value={fuel} onChange={(e) => setFuel(e.target.value)}>
          {fuels.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)}>
          {years.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      <Chart data={monthlyData} />
    </div>
  );
};

export default App;
