import { Token, UserInfo } from "./types";

export async function authRegister(username: string, email: string, password: string): Promise<void> {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_HOSTNAME}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            email,
            password
        }),
    })

    if(!response.ok) {
        throw Error("problem creating user")
    }
}

export async function authGetAccessToken(username: string, password: string): Promise<string | null> {
    const formData = new FormData();
    formData.append("username", username)
    formData.append("password", password)

    const response = await fetch(`${process.env.REACT_APP_BACKEND_HOSTNAME}/auth/token`, {
        method: "POST",
        body: formData
    });

    if(response.ok){
        return (await response.json() as Token).access_token;
    }
    return null;
}

export async function authGetCurrentUser(accessToken: string): Promise<UserInfo> {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_HOSTNAME}/auth/me`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if(!response.ok){
        // TODO
    }
    return await response.json() as UserInfo;
}
