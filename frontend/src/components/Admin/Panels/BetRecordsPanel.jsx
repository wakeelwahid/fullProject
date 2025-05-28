import React, { useState, useEffect } from "react";
import "./panels.css";

const BetRecordsPanel = () => {
  const games = [
    "JAIPUR KING",
    "GALI",
    "FARIDABAD",
    "DISAWER",
    "GHAZIABAD",
    "DIAMOND KING",
  ];

  const [selectedGame, setSelectedGame] = useState(games[0]);
  const [betRecords, setBetRecords] = useState({
    numberWiseBets: {},
    totalBets: 0,
    totalAmount: 0,
  });

  const [sortColumn, setSortColumn] = useState(null); // e.g. amount, andarAmount
  const [sortDirection, setSortDirection] = useState("asc");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBetRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`http://localhost:8000/api/admin/bets/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch bet records");

      const data = await res.json();
      console.log("Fetched data:", data);
      const selectedData = data[selectedGame];

      if (!selectedData || !selectedData.numberWiseBets) {
        setBetRecords({
          numberWiseBets: {},
          totalBets: 0,
          totalAmount: 0,
        });
        setLoading(false);
        return;
      }

      const totalBetsCount = Object.keys(selectedData.numberWiseBets).length;

      setBetRecords({
        numberWiseBets: selectedData.numberWiseBets,
        totalBets: totalBetsCount,
        totalAmount: 0,
      });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBetRecords();
  }, [selectedGame]);

  const numberTotal = Object.values(betRecords.numberWiseBets).reduce(
    (sum, data) => sum + (data.amount || 0),
    0
  );
  const andarTotal = Object.values(betRecords.numberWiseBets).reduce(
    (sum, data) => sum + (data.andarAmount || 0),
    0
  );
  const baharTotal = Object.values(betRecords.numberWiseBets).reduce(
    (sum, data) => sum + (data.baharAmount || 0),
    0
  );
  const totalAmount = numberTotal + andarTotal + baharTotal;

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedBets = Object.entries(betRecords.numberWiseBets).sort((a, b) => {
    if (!sortColumn) return 0;

    const valA =
      sortColumn === "totalAmount"
        ? (a[1].amount || 0) + (a[1].andarAmount || 0) + (a[1].baharAmount || 0)
        : a[1][sortColumn] || 0;

    const valB =
      sortColumn === "totalAmount"
        ? (b[1].amount || 0) + (b[1].andarAmount || 0) + (b[1].baharAmount || 0)
        : b[1][sortColumn] || 0;

    return sortDirection === "asc" ? valA - valB : valB - valA;
  });

  return (
    <div className="panel bet-records-panel">
      <h2 className="panel-title">Bet Records</h2>

      <div className="bet-records-controls">
        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          className="game-select dark"
        >
          {games.map((game) => (
            <option key={game} value={game}>
              {game}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading bet records...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          <div className="bet-records-summary">
            <div className="summary-card">
              <h3>Total Bets</h3>
              <p>{betRecords.totalBets}</p>
            </div>
            <div className="summary-card highlight">
              <h3>Total Bet Amount</h3>
              <p>₹{totalAmount}</p>
            </div>
            <div className="summary-card number-total">
              <h3>Total Number Amount</h3>
              <p>₹{numberTotal}</p>
            </div>
            <div className="summary-card andar">
              <h3>Andar Total</h3>
              <p>₹{andarTotal}</p>
            </div>
            <div className="summary-card bahar">
              <h3>Bahar Total</h3>
              <p>₹{baharTotal}</p>
            </div>
          </div>

          <div className="bet-records-table">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Number</th>
                  <th onClick={() => handleSort("amount")}>
                    Number Amount{" "}
                    {sortColumn === "amount"
                      ? sortDirection === "asc"
                        ? "🔼"
                        : "🔽"
                      : ""}
                  </th>
                  <th>Andar Number</th>
                  <th onClick={() => handleSort("andarAmount")}>
                    Andar Amount{" "}
                    {sortColumn === "andarAmount"
                      ? sortDirection === "asc"
                        ? "🔼"
                        : "🔽"
                      : ""}
                  </th>
                  <th>Bahar Number</th>
                  <th onClick={() => handleSort("baharAmount")}>
                    Bahar Amount{" "}
                    {sortColumn === "baharAmount"
                      ? sortDirection === "asc"
                        ? "🔼"
                        : "🔽"
                      : ""}
                  </th>
                  <th onClick={() => handleSort("totalAmount")}>
                    Total Amount{" "}
                    {sortColumn === "totalAmount"
                      ? sortDirection === "asc"
                        ? "🔼"
                        : "🔽"
                      : ""}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedBets.map(([number, data]) => {
                  const total =
                    (data.amount || 0) +
                    (data.andarAmount || 0) +
                    (data.baharAmount || 0);
                  return (
                    <tr key={number}>
                      <td>{number}</td>
                      <td>₹{data.amount || 0}</td>
                      <td>{data.andarNumber || "-"}</td>
                      <td>₹{data.andarAmount || 0}</td>
                      <td>{data.baharNumber || "-"}</td>
                      <td>₹{data.baharAmount || 0}</td>
                      <td>₹{total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default BetRecordsPanel;
