import { Page, Game } from "@/lib/types"

export async function games(): Promise<Page<Game>> {
  const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_HOSTNAME}/v1/games`, { method: "GET" })
  return (await response.json())
}

