import { Profile } from "./types";


export async function getUserProfile(userId: string): Promise<Profile> {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_HOSTNAME}/profile/${userId}`);
    return await response.json() as Profile;
}
