import type { User } from '../shared/user.ts';

export const users: User[] = [
    { id: 1, name: "Test", username: "test", password: "test", watchedMovies: [
        { id: 1, liked: true },
        { id: 2, liked: false},
    ] },
];