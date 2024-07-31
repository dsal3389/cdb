import { CurrentUser, Token } from "@/lib/types";

export async function authenticationToken(username: string, password: string): Promise<Token> {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_HOSTNAME}/v1/auth/token`, { method: "POST", body: formData });
  const response_json = await response.json();

  if (!response.ok) {
    throw new Error(response_json.detail);
  }
  return response_json;
}

export async function authGetCurrentUser(token: string): Promise<CurrentUser> {
  const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_HOSTNAME}/v1/auth/me`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` }
  });
  const response_json = await response.json();
  if (!response.ok) {
    throw new Error(response_json.details)
  }
  return response_json
}

