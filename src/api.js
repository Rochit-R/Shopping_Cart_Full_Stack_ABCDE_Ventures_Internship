const API_URL = "http://localhost:8080";

export async function login(username, password) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (res.status === 200) return await res.json();
  throw new Error("Invalid username/password");
}

export async function getItems(token) {
  const res = await fetch(`${API_URL}/items`, {
    headers: { Authorization: token },
  });
  return await res.json();
}

export async function addToCart(token, itemId) {
  const res = await fetch(`${API_URL}/carts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({ item_id: itemId }),
  });
  return await res.json();
}

export async function getCart(token) {
  const res = await fetch(`${API_URL}/carts`, {
    headers: { Authorization: token },
  });
  return await res.json();
}

export async function createOrder(token, cartId) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({ cart_id: cartId }),
  });
  return await res.json();
}

export async function getOrders(token) {
  const res = await fetch(`${API_URL}/orders`, {
    headers: { Authorization: token },
  });
  return await res.json();
}