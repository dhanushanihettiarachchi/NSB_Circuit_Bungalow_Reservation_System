// src/services/auth.ts
import * as SecureStore from "expo-secure-store";
import { API_BASE } from "./config";

const TOKEN_KEY = "token";

export async function loginApi(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });

  if (res.status === 401) {
    throw new Error("Invalid credentials");
  }
  if (!res.ok) {
    const j = await res.json().catch(() => null);
    throw new Error(j?.message || "Login failed");
  }
  return res.json(); // { token, user }
}

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function logout() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
