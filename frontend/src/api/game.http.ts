import { Page, GameInfo } from "./types";

interface GameListParams {
    index: number | string
}

export async function ListGames({ index }: GameListParams): Promise<Page<GameInfo>> {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_HOSTNAME}/games/?page=${index}`);
    return await response.json();
}
