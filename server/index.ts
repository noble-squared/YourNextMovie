import { Hono } from 'hono'
import 'dotenv/config';
import { serve } from '@hono/node-server'
import { users } from './users.ts';
//import type { User } from '../shared/user.ts';
import filterSchema from '../shared/FilterSchema.ts';
import type { CompleteMovie, RankedMovie, SingleMovie, TMDBSearchResponse } from '../shared/MovieTypes.ts';
import { getMovieSimilarity, getMovieDisSimilarity } from './compareMovies.ts';

//https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status#client_error_responses

//let currentUser : User | null = null;
const app = new Hono();

const apiKey = process.env.TMDB_API_KEY;

app.get('/', (c) => {
  return c.json({
    ok: true,
    message: 'Hello Hono!',
  })
})


app.get('/users', (c) => {
  return c.json(users);
});

//#region Old user Auth code
/*
app.post('/login', async (c) => {
  const { username, password } = await c.req.json();

  for(const user of users) {
    if(user.username === username) {
      if(user.password === password) {
        currentUser = user;
        return c.json({ success: true });
      } else {
        return c.json({ success: false, error: 'Invalid username or password' }, 401);
      }
    }
  }

  return c.json({ success: false, error: 'Invalid username or password' }, 401);
});


app.post('/signup', async (c) => {
  const { id, name, username, password } = await c.req.json();

  for(const user of users) {
    if(user.username === username) {
      return c.json({ success: false, error: 'Username already taken' }, 400);
    }
  }

  users.push({ id, name, username, password, watchedMovies: [] });

  return c.json({ success: true });
});

//I dunno whether I actually want this to be an option lol
const resetPasswordCode : string | null = "I am not a bot"; //this is literally so insecure lmfao
//const resetPasswordCode : string | null = null; 
app.get('/reset-code', async (c) => {
  if(!resetPasswordCode) {
    return c.json({ success: false, error: "Not currently allowing password resets" });
  } else { 
    return c.json({ success: true, code: resetPasswordCode});
  }
});
app.post('/reset-password', async (c) => {
  const { username, newPassword, code } = await c.req.json();
  if(!code || code !== resetPasswordCode) {
    return c.json({ success: false, error: 'Please type the reset validation code exactly as listed' }, 401);
  }
  
  const user = users.find(user => user.username === username);
  if(user) {
    user.password = newPassword;
  }
});


app.post('/logout', (c) => {
  currentUser = null;
  return c.json({ success: true });
});


app.get('/userdata', (c) => {
  if(!currentUser) {
    return c.json({ 
      success: false,
      error: 'Not logged in'}, 401);
  } else {
    return c.json({
      success: true,
      user: currentUser
    });
  }
});
*/
//#endregion

app.post('/api/get-filtered-movies', async (c) => {
  const parseResult = filterSchema.safeParse(c.req.query());

  if(!parseResult.success) {
    return c.json({ ok: false, error: parseResult.error.message }, 400);
  }

  const filters = parseResult.data;

  let queryString = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}${filters.title ? `&query=${filters.title}` : ""}${filters.genre ? `&with_genres=${filters.genre}` : ""}${filters.year ? `&primary_release_year=${filters.year}` : ""}`;
  //queryString += 

  try {
    const res = await fetch(queryString);

    if (!res.ok) {
      console.error(`TMDB request failed with status ${res.status}`);
      return c.json({
        ok: false,
        error: `TMDB request failed with status ${res.status}`,
      }, 502);
    }

    const data = await res.json() as TMDBSearchResponse;

    if(data.results.length === 0) {
      console.error("No results");
      return c.json({
        ok: false,
        error: "No results",
      }, 400);
    }

    return c.json(data);

  } catch (error) {
    console.log(error);
    if(error instanceof Error){
      console.error(error.message);
      return c.json({ 
        ok: false,
        error: error.message,
      }, 400);
    }
    return c.json({
      ok: false,
      error: error,
    }, 502);
  }

})

app.get('/api/test', (c) => {
  return c.json({ key: process.env.TMDB_API_KEY });
});

app.get('/api/get-movies', async (c) => {
  //I'm running into an error where my first request will always fail, due to a "bad gateway", but the second is always just fine. That is a Tomorrow problem though.

  try {
    const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=batman`);

    if (!res.ok) {
      console.error(`TMDB request failed with status ${res.status}`);
      return c.json({
        ok: false,
        error: `TMDB request failed with status ${res.status}`,
      });
    }

    const data = await res.json() as TMDBSearchResponse;

    if(data.results.length === 0) {
      console.error("No results");
      return c.json({
        ok: false,
        error: "No results",
      })
    }

    return c.json(data);
  } catch (error) {
    if(error instanceof Error){
      console.error(error.message);
      return c.json({ 
        ok: false,
        error: error.message,
      }, 400);
    }
    return c.json({
      ok: false,
      error: error,
    }, 502);
  }
});

app.get('/api/get-movie/:movieID', async (c) => {
  const { movieID } = c.req.param();
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${apiKey}`);

    if(!res.ok){
      console.error(`TMDB request failed with status ${res.status}`);
      return c.json({
        ok: false,
        error: `TMDB request failed with status ${res.status}`,
      }, 502);
    } 

    const movie = await res.json() as SingleMovie;

    return c.json({
      ok: true,
      results: movie,
    });
  } catch (error) {
    if(error instanceof Error){
      console.error(error.message);
      return c.json({ 
        ok: false,
        error: error.message,
      }, 400);
    }
    return c.json({
      ok: false,
      error: error,
    }, 502);
  }
});

app.get('/api/get-similar-movies/:movieID', async (c) => {
  const { movieID } = c.req.param(); 
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${apiKey}`);

    if(!res.ok){
      console.error(`TMDB request failed with status ${res.status}`);
      return c.json({
        ok: false,
        error: `TMDB request failed with status ${res.status}`,
      }, 502);
    } 

    const OGMovie = await res.json() as CompleteMovie;

    const similarityRes = await fetch(`https://api.themoviedb.org/3/movie/${movieID}/similar?api_key=${apiKey}`);

    if(!similarityRes.ok){
      console.error(`TMDB request failed with status ${similarityRes.status}`);
      return c.json({
        ok: false,
        error: `TMDB request failed with status ${similarityRes.status}`,
      }, 502);
    } 

    const similarityData = await similarityRes.json() as TMDBSearchResponse;

    const rankedMovies : RankedMovie[] = similarityData.results.map((movie) => {
      const score = getMovieSimilarity(OGMovie, movie);

      return {
        movie: movie,
        ranking: score,
      } as RankedMovie;
    });

    rankedMovies.sort((a, b) => b.ranking - a.ranking);

    return c.json({ 
      ok: true, 
      movies: rankedMovies 
    });
  } catch (error) {
    if(error instanceof Error){
      console.error(error.message);
      return c.json({ 
        ok: false,
        error: error.message,
      }, 400);
    }
    return c.json({
      ok: false,
      error: error,
    }, 502);
  }
});

app.get('/api/get-different-movies/:movieID', async (c) => {
  const { movieID } = c.req.param(); 
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieID}/similar?api_key=${apiKey}`);

    if(!res.ok){
      console.error(`TMDB request failed with status ${res.status}`);
      return c.json({
        ok: false,
        error: `TMDB request failed with status ${res.status}`,
      }, 502);
    } 

    const OGMovie = await res.json() as CompleteMovie;

    const similarityRes = await fetch(`https://api.themoviedb.org/3/movie/${movieID}/similar?api_key=${apiKey}`);

    if(!similarityRes.ok){
      console.error(`TMDB request failed with status ${similarityRes.status}`);
      return c.json({
        ok: false,
        error: `TMDB request failed with status ${similarityRes.status}`,
      }, 502);
    } 

    const similarityData = await similarityRes.json() as TMDBSearchResponse;

    const rankedMovies : RankedMovie[] = similarityData.results.map((movie) => {
      const score = getMovieDisSimilarity(OGMovie, movie);

      return {
        movie: movie,
        ranking: score,
      } as RankedMovie;
    });

    rankedMovies.sort((a, b) => b.ranking - a.ranking);

    return c.json({ 
      ok: true, 
      movies: rankedMovies 
    });
  } catch (error) {
    if(error instanceof Error){
      console.error(error.message);
      return c.json({ 
        ok: false,
        error: error.message,
      }, 400);
    }
    return c.json({
      ok: false,
      error: error,
    }, 502);
  }
});

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})