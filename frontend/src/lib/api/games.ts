import { Page, GameInfo } from "@/lib/types"

export async function games(): Promise<Page<GameInfo>> {
  const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_HOSTNAME}/games`, { method: "GET" })
  return (await response.json())
}

