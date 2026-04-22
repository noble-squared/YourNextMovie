import type { CompleteMovie } from "../shared/MovieTypes.ts"
import { genreNumbers } from "../shared/movieGenres.ts"
import genreRelationships from "./genreRelationships.ts"

const genreModifier = 2;
const ogLanguageModifier = 5;
const popularityModifier = .25;

const genreDislikeModifier = -1;
const genreLikeModifier = 1;

export function getMovieSimilarity(OGMovie: CompleteMovie, comparisonMovie: CompleteMovie) {
    const genreScore = getGenreSimilarityScore(OGMovie.genre_ids, comparisonMovie.genre_ids);

    const ogLanguage = (OGMovie.original_language == comparisonMovie.original_language) ? 1 : 0;

    const popularity = comparisonMovie.popularity;

    return (
        genreScore*genreModifier
        + ogLanguage*ogLanguageModifier 
        + popularity*popularityModifier 
    );
}

export function getMovieDisSimilarity(OGMovie: CompleteMovie, comparisonMovie: CompleteMovie) {
    const genreScore = getGenreSimilarityScore(OGMovie.genre_ids, comparisonMovie.genre_ids);

    const ogLanguage = (OGMovie.original_language == comparisonMovie.original_language) ? 1 : 0;

    const popularity = comparisonMovie.popularity;

    return (
        1 - (genreScore*genreModifier)
        + ogLanguage*ogLanguageModifier 
        + popularity*popularityModifier 
    );
}

function getGenreSimilarityScore(OGGenreIDs: number[] | null | undefined, compGenreIDs: number[] | null | undefined) {
    const safeOGGenreIDs = Array.isArray(OGGenreIDs) ? OGGenreIDs : [];
    const safeCompGenreIDs = Array.isArray(compGenreIDs) ? compGenreIDs : [];

    if (safeOGGenreIDs.length === 0 || safeCompGenreIDs.length === 0) {
        return 0;
    }

    let genreScore = 0;
    for(let outer of safeOGGenreIDs) {
        const outerGenre = genreNumbers.get(outer) || "Adventure";
        let innerGenreScore = 0;
        for(let inner of safeCompGenreIDs){
            const innerGenre = genreNumbers.get(inner) || "Adventure";
            innerGenreScore += genreRelationships.get(outerGenre)?.get(innerGenre) || 0;
        }
        genreScore += innerGenreScore / safeCompGenreIDs.length;
    }
    return genreScore / safeOGGenreIDs.length;
}

export function getUserMovieSimilarityScore(
    LikedGenres: string[], 
    DislikedGenres: string[],
    OGMovie: CompleteMovie, 
    comparisonMovie: CompleteMovie
) { 
    const genreScore = getUserGenreSimilarityScores(LikedGenres, DislikedGenres, OGMovie.genre_ids, comparisonMovie.genre_ids);
    
    const ogLanguage = (OGMovie.original_language == comparisonMovie.original_language) ? 1 : 0;

    const popularity = comparisonMovie.popularity;

    return (
                genreScore*genreModifier
        + ogLanguage*ogLanguageModifier 
        + popularity*popularityModifier 
      );
}

export function getUserMovieDisSimilarityScore(
    LikedGenres: string[], 
    DislikedGenres: string[],
    OGMovie: CompleteMovie, 
    comparisonMovie: CompleteMovie
) { 
    const genreScore = getUserGenreSimilarityScores(LikedGenres, DislikedGenres, OGMovie.genre_ids, comparisonMovie.genre_ids);
    
    const ogLanguage = (OGMovie.original_language == comparisonMovie.original_language) ? 1 : 0;

    const popularity = comparisonMovie.popularity;

    return (
        1 - (genreScore*genreModifier)
        + ogLanguage*ogLanguageModifier 
        + popularity*popularityModifier 
      );
}

function getUserGenreSimilarityScores(
        LikedGenres: string[], 
        DislikedGenres: string[], 
        OGGenreIDs: number[] | null | undefined, 
        compGenreIDs: number[] | null | undefined
    ) {
    const safeOGGenreIDs = Array.isArray(OGGenreIDs) ? OGGenreIDs : [];
    const safeCompGenreIDs = Array.isArray(compGenreIDs) ? compGenreIDs : [];

    if (safeOGGenreIDs.length === 0 || safeCompGenreIDs.length === 0) {
        return 0;
    }

    let genreScore = 0;
    for(let outer of safeOGGenreIDs) {
        const outerGenre = genreNumbers.get(outer) || "Adventure";
        let innerGenreScore = 0;
        for(let inner of safeCompGenreIDs){
            const innerGenre = genreNumbers.get(inner) || "Adventure";
            innerGenreScore += genreRelationships.get(outerGenre)?.get(innerGenre) || 0;
            if(LikedGenres.includes(innerGenre)){
                innerGenreScore += genreLikeModifier;
            } else if(DislikedGenres.includes(innerGenre)){
                innerGenreScore += genreDislikeModifier;
            }
        }
        genreScore += innerGenreScore / safeCompGenreIDs.length;
    }
    return genreScore / safeOGGenreIDs.length;
}