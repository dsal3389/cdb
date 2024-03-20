
export interface Page<T> {
    index: number,
    next: string | null,
    results: T[]
};

export interface Token {
    access_token: string,
    token_type: string
};

export interface UserInfo {
    id: string,
    username: string,
    email: string,
    image: string,
    elo: number
};

export interface ProfileBrief {
    id: string
    username: string
    image: string
    elo: number
}

export enum GameStatus {
    white_win = "white_win",
    black_win = "black_win",
    draw = "draw"
}

export interface GameInfo {
    id: number,
    approved: boolean,
    white_player: ProfileBrief
    black_player: ProfileBrief
    status: GameStatus
};

