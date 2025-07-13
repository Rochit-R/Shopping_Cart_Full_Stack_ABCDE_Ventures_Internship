import React, { useState } from "react";
import Login from "./components/Login";
import ItemList from "./components/ItemList";
import CartButton from "./components/CartButton";
import OrderHistoryButton from "./components/OrderHistoryButton";
import CheckoutButton from "./components/CheckoutButton";
import LogoutButton from "./components/LogoutButton";

import { Toaster } from "react-hot-toast";
import "./styles.css";

function App() {
  const [token, setToken] = useState("");
  const [ordered, setOrdered] = useState(false);

  if (!token)
    return (
      <div className="app-container login-bg">
        <Login onLogin={setToken} />
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    );

  return (
    <div className="app-container main-bg">
      <h1 className="title">🛒 Shopping Cart Dashboard</h1>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
  <CheckoutButton token={token} onOrder={() => setOrdered(true)} />
  <CartButton token={token} />
  <OrderHistoryButton token={token} />
  <LogoutButton onLogout={() => setToken("")} />
</div>

      <ItemList token={token} key={ordered} />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default App;