import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import MoviesPage from './pages/Movies.tsx';
import Login from './components/Login.tsx';
import Layout from './components/Layout.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import IndividualMoviePage from './pages/IndividualMovie.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Layout>
          <Routes>
            <Route
              path="/"
              element={
                <App />
              }
            />
            <Route
              path="/movies"
              element={
                <MoviesPage />
              }
            />
            <Route
              path="/login"
              element={
                <Login />
              }
            />
            <Route 
              path="/movie/:id"
              element={
                <IndividualMoviePage />
              }
            />
          </Routes>
      </Layout>
    </BrowserRouter>
  </StrictMode>,
)
