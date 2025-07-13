import React, { useEffect, useState } from "react";
import { getItems, addToCart } from "../api";
import toast from "react-hot-toast";

export default function ItemList({ token }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getItems(token).then(setItems);
  }, [token]);

  function handleAdd(itemId) {
    addToCart(token, itemId)
      .then(() => toast.success("🛒 Item added to cart"))
      .catch(() => toast.error("⚠️ Failed to add item"));
  }

  return (
    <div>
      <h2 className="title">Available Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item.ID}>
            {item.Name}
            <button onClick={() => handleAdd(item.ID)} style={{ marginLeft: 10 }}>
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}