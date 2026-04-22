import type { User as SupabaseUser } from '@supabase/supabase-js'

export interface AuthContextUserData {
  readonly [key: string]: string | number | Date | boolean | string[];
}

export interface UserProfileData {
  full_name: string,
  username: string,
  see_adult: boolean,
  liked_genres: string[],
  disliked_genres: string[],
  watched_movies: number[],
}

export type AuthUser = SupabaseUser & UserProfileData