
export interface Page<T> {
    index: number
    prev: boolean
    next: boolean
    count: number
    results: T[]
};

export interface Token {
    access_token: string
    token_type: string
};

export interface UserInfo {
    id: string
    username: string
    email: string
    image: string
    elo: number
};

export interface ProfileBrief {
    id: string
    username: string
    image: string
    elo: number
}

export interface Profile {
    id: string
    username: string
    image: string
    elo: number
}


export enum GameStatus {
    WhiteWin = "white_win",
    BlackWin = "black_win",
    Draw = "draw"
}

export enum GameType {
    Bullet = "BULLET",
    Blitz = "BLITZ",
    Rapid = "RAPID"
}

export interface GameInfo {
    id: number,
    approved: boolean,
    white_player: ProfileBrief
    black_player: ProfileBrief
    status: GameStatus
    register_date: string
    play_date: string
    type: GameType
}


export interface GamesStatusCount {
    white_win: number,
    black_win: number,
    draw: number,
}


export interface ProfilePage {
    profile: Profile,
    games_status: GamesStatusCount
}