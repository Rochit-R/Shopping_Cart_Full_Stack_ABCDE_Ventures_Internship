import React from "react";
import { getOrders } from "../api";
import toast from "react-hot-toast";

export default function OrderHistoryButton({ token }) {
  async function handleClick() {
    try {
      const orders = await getOrders(token);
      const orderIDs = orders.map(order => order.ID).join(", ");
      toast.success("🧾 Order IDs: " + orderIDs);
    } catch {
      toast.error("⚠️ Could not fetch orders");
    }
  }

  return <button onClick={handleClick}>Order History</button>;
}