export type TMDBSearchResponse = {
  page: number;
  results: CompleteMovie[];
  total_pages: number;
  total_results: number;
};

export interface RankedMovie {
    movie: SingleMovie;
    ranking: number;
}

export interface simplestMovie {
    id: number
}

export interface DatabaseUserMovie {
    id: number;
    liked: boolean;
}

export interface MoviePreview {
    id: number;
    name: string;
    year: number;
    image: File;
}

export interface Movie {
    id: number;
    name: string;
    year: number;
    image: File;
    description: string;
    rating: number;

}

//TODO: finish adding the fields
export interface CompleteMovie {
    id: number;
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    release_date: string;
    title: string;
    vote_average: number;
    vote_count: number;
};

export interface Genre {
    id: number;
    name: string;
}

export interface SingleMovie extends CompleteMovie {
    genres: Genre[];
}