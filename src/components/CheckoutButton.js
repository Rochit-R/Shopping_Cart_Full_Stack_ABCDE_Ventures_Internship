import React from "react";
import { getCart, createOrder } from "../api";
import toast from "react-hot-toast";

export default function CheckoutButton({ token, onOrder }) {
  async function handleClick() {
    try {
      const carts = await getCart(token);
      if (carts.length > 0) {
        await createOrder(token, carts[0].ID);
        toast.success("✅ Order placed!");
        onOrder();
      } else {
        toast("🛒 No cart to checkout.");
      }
    } catch {
      toast.error("❌ Checkout failed");
    }
  }

  return <button onClick={handleClick}>Checkout</button>;
}