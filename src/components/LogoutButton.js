import React from "react";
import toast from "react-hot-toast";

export default function LogoutButton({ onLogout }) {
  function handleClick() {
    toast("👋 Logged out!");
    onLogout();
  }

  return <button onClick={handleClick}>Logout</button>;
}
