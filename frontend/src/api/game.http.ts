import { Page, GameInfo } from "./types";

interface GameListParams {
    index: number | string,
    approved_only: boolean
}

export async function ListGames({ index, approved_only }: GameListParams): Promise<Page<GameInfo>> {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_HOSTNAME}/games/`);
    return await response.json();
}
