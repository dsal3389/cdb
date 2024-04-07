import { GameInfo, Page, ProfilePage } from "./types";


export async function getUserProfile(userId: string): Promise<ProfilePage> {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_HOSTNAME}/profile/${userId}`);
    return await response.json() as ProfilePage;
}

export async function getUserProfileGames(userId: string, page: number): Promise<Page<GameInfo>> {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_HOSTNAME}/profile/${userId}/games?page=${page}`);
    return await response.json() as Page<GameInfo>;
}
