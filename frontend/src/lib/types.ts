export interface Token {
  access_token: string,
  token_type: string
}

export interface Page<T> {
  results: T[],
  index: number,
  count: number,
  prev: boolean,
  next: boolean
}

export interface CurrentUser {
  id: string,
  username: string,
  image: string,
  elo: number
}

export interface UserBrief {
  id: string,
  username: string,
  image: string,
  elo: number
}

export enum GameStatus {
  white_win = "white_win",
  black_win = "black_win",
  draw = "draw"
}

export enum GameType {
  BULLET = "BULLET",
  BLITZ = "BLITZ",
  RAPID = "RAPID"
}

export interface Game {
  id: number,
  approved: boolean,
  time_control: string,
  white_player: UserBrief,
  black_player: UserBrief,
  status: GameStatus,
  register_date: string,
  play_date: string,
  type: GameType,
}

