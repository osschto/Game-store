export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Platform {
  id: number;
  name: string;
}

export interface Game {
  id: number;
  genre_id: number;
  platform_id: number;
  title: string;
  description: string;
  price: number;
  release_date: string;
  developer: string;
  rating: number;
}

export interface Order {
  id: number;
  user_id: number;
  game_id: number;
  game_price: number;
}

export interface Review {
  user_id: number;
  game_id: number;
  rating: number;
  comment: string;
}

export interface UserAdd {
  name: string;
  email: string;
}

export interface GameAdd {
  genre_id: number;
  platform_id: number;
  title: string;
  description: string;
  price: number;
  release_date: string;
  developer: string;
}

export interface OrderAdd {
  user_id: number;
  game_id: number;
}

export interface ReviewAdd {
  user_id: number;
  game_id: number;
  rating: number;
  comment: string;
}

export interface ApiError {
  detail: string;
}
