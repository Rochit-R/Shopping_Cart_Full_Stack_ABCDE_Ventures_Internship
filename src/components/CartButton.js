import React from "react";
import { getCart } from "../api";
import toast from "react-hot-toast";

export default function CartButton({ token }) {
  async function handleClick() {
    try {
      const carts = await getCart(token);
      if (carts.length > 0) {
        const cart = carts[0];
        const items = cart.CartItems?.map(ci => `🧾 item_id: ${ci.ItemID}`).join(", ");
        toast.success(`Cart ID: ${cart.ID}\n${items}`);
      } else {
        toast("🛒 Cart is empty.");
      }
    } catch {
      toast.error("⚠️ Failed to fetch cart");
    }
  }

  return <button onClick={handleClick}>View Cart</button>;
}