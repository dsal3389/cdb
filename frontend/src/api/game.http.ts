import { Page, GameInfo } from "./types";

interface GameListParams {
    index: number | string,
    approved_only: boolean
}

export async function ListGames({ index, approved_only }: GameListParams): Promise<Page<GameInfo>> {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_HOSTNAME}/games?approved_only=${approved_only}`);
    return await response.json();
}
