export interface User {
    id: number;
    name: string;
    username: string;
    password: string;
    watchedMovies: DatabaseMovie[]; // Array of movie IDs that the user has watched, and whether they liekd them or not
}

export interface DatabaseMovie {
    id: number;
    liked: boolean;
}