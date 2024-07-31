import { Results, ProfileBrief } from "@/lib/types";

export async function lookupUsersProfileBrief(username: string): Promise<Results<ProfileBrief>> {
  const url = new URL(`${import.meta.env.VITE_APP_BACKEND_HOSTNAME}/v1/profile/lookup`);
  url.searchParams.append("username", username);

  const response = await fetch(url, { method: "GET" });
  const response_json = await response.json();
  return response_json;
}

