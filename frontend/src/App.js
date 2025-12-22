import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [userId, setUserId] = useState("");
  const [side, setSide] = useState("YES");
  const [action, setAction] = useState("BUY");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [trades, setTrades] = useState([]);
  const [orderBook, setOrderBook] = useState({});

  useEffect(() => {
    fetchOrderBook();
  }, []);

  const fetchOrderBook = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/orderbook");
      setOrderBook(response.data);
    } catch (err) {
      console.error("Failed to fetch order book:", err);
    }
  };

  const submitOrder = async () => {
    if (!userId) return alert("Enter User ID");
    try {
      const response = await axios.post("http://127.0.0.1:8000/order", {
        user_id: userId,
        side,
        action,
        price: Number(price),
        quantity: Number(quantity),
      });
      if (response.data.trades) {
        setTrades(prev => [...response.data.trades, ...prev]);
        fetchOrderBook();
      }
    } catch (err) {
      alert(err.response?.data?.detail || err.message);
    }
  };

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#0f111a",
      color: "white",
      minHeight: "100vh",
      padding: "20px",
    },
    title: {
      textAlign: "center",
      fontSize: "2rem",
      marginBottom: "20px",
      color: "#00e5ff",
    },
    form: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      justifyContent: "center",
      marginBottom: "30px",
    },
    inputContainer: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "5px",
    },
    inputLabel: {
      fontSize: "0.85rem",
      marginBottom: "2px",
      color: "#a0a0a0",
    },
    input: {
      padding: "8px 12px",
      borderRadius: "5px",
      border: "1px solid #444",
      backgroundColor: "#1a1a2e",
      color: "white",
      outline: "none",
      minWidth: "100px",
    },
    button: {
      padding: "8px 16px",
      border: "none",
      borderRadius: "5px",
      backgroundColor: "#00e676",
      color: "#0f111a",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "0.2s",
    },
    buttonHover: {
      backgroundColor: "#00c853",
    },
    buttonActive: {
      backgroundColor: "#009624",
    },
    main: {
      display: "flex",
      gap: "20px",
      justifyContent: "space-between",
    },
    marketSection: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      width: "400px",
      padding: "10px",
      borderRadius: "10px",
    },
    yesMarket: {
      backgroundColor: "#1a1a2e",
      border: "2px solid #00e5ff",
    },
    noMarket: {
      backgroundColor: "#1a1a2e",
      border: "2px solid #ff3d00",
    },
    tradesSection: {
      backgroundColor: "#1a1a2e",
      border: "2px solid #ffeb3b",
      width: "300px",
      padding: "10px",
      borderRadius: "10px",
    },
    marketTables: {
      display: "flex",
      gap: "10px",
    },
    card: {
      backgroundColor: "#2a2a3e",
      padding: "10px",
      borderRadius: "8px",
      flex: 1,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      borderBottom: "1px solid #555",
      textAlign: "left",
      padding: "6px",
      fontSize: "0.9rem",
    },
    td: {
      padding: "4px 6px",
      fontSize: "0.85rem",
    },
    buy: { color: "#00e676", fontWeight: "bold" },
    sell: { color: "#ff3d00", fontWeight: "bold" },
    market: {
      backgroundColor: "#ffeb3b",
      color: "#0f111a",
      padding: "2px 5px",
      borderRadius: "3px",
    },
  };

  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const renderOrderTable = (orders, type) => (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Price</th>
          <th style={styles.th}>Qty</th>
          <th style={styles.th}>User</th>
        </tr>
      </thead>
      <tbody>
        {orders?.length === 0 && (
          <tr>
            <td colSpan="3">No {type} orders</td>
          </tr>
        )}
        {orders?.map(([p, t, o], idx) => (
          <tr key={idx}>
            <td style={{ ...styles.td, ...(o.price === 0 ? styles.market : type === "BUY" ? styles.buy : styles.sell) }}>
              {Math.abs(p)}
            </td>
            <td style={styles.td}>{o.quantity}</td>
            <td style={styles.td}>{o.user_id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Prediction Market Dashboard</h1>

      {/* Order Form */}
      <div style={styles.form}>
        <div style={styles.inputContainer}>
          <label style={styles.inputLabel}>User ID</label>
          <input
            style={styles.input}
            placeholder="Enter your ID"
            value={userId}
            onChange={e => setUserId(e.target.value)}
          />
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.inputLabel}>Side</label>
          <select style={styles.input} value={side} onChange={e => setSide(e.target.value)}>
            <option value="YES">YES</option>
            <option value="NO">NO</option>
          </select>
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.inputLabel}>Action</label>
          <select style={styles.input} value={action} onChange={e => setAction(e.target.value)}>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.inputLabel}>Price</label>
          <input
            style={styles.input}
            type="number"
            placeholder="1-99 or 0 for market"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.inputLabel}>Quantity</label>
          <input
            style={styles.input}
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
          />
        </div>

        <button
          style={{
            ...styles.button,
            ...(hover ? styles.buttonHover : {}),
            ...(active ? styles.buttonActive : {}),
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onMouseDown={() => setActive(true)}
          onMouseUp={() => setActive(false)}
          onClick={submitOrder}
        >
          Submit Order
        </button>
      </div>

      {/* Main Layout */}
      <div style={styles.main}>
        {/* YES Market */}
        <div style={{ ...styles.marketSection, ...styles.yesMarket }}>
          <h2>YES Market</h2>
          <div style={styles.marketTables}>
            <div style={styles.card}>
              <strong>BUY Orders</strong>
              {renderOrderTable(orderBook["YES"]?.BUY, "BUY")}
            </div>
            <div style={styles.card}>
              <strong>SELL Orders</strong>
              {renderOrderTable(orderBook["YES"]?.SELL, "SELL")}
            </div>
          </div>
        </div>

        {/* NO Market */}
        <div style={{ ...styles.marketSection, ...styles.noMarket }}>
          <h2>NO Market</h2>
          <div style={styles.marketTables}>
            <div style={styles.card}>
              <strong>BUY Orders</strong>
              {renderOrderTable(orderBook["NO"]?.BUY, "BUY")}
            </div>
            <div style={styles.card}>
              <strong>SELL Orders</strong>
              {renderOrderTable(orderBook["NO"]?.SELL, "SELL")}
            </div>
          </div>
        </div>

        {/* Recent Trades */}
        <div style={styles.tradesSection}>
          <h2>Recent Trades</h2>
          <div style={styles.card}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Buyer</th>
                  <th style={styles.th}>Seller</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Qty</th>
                </tr>
              </thead>
              <tbody>
                {trades.length === 0 && (
                  <tr>
                    <td colSpan="4">No trades yet</td>
                  </tr>
                )}
                {trades.map((t, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}>{t.buyer}</td>
                    <td style={styles.td}>{t.seller}</td>
                    <td style={styles.td}>{t.price}</td>
                    <td style={styles.td}>{t.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
