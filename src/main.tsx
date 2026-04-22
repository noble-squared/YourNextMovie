import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import MoviesPage from './pages/Movies.tsx';
import AuthenticationPage from './pages/Authentication.tsx';
import ProfilePage from './pages/Profile.tsx';
import Layout from './components/Layout.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import IndividualMoviePage from './pages/IndividualMovie.tsx';

import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
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
              path="/authentication"
              element={
                <AuthenticationPage />
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
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
    </AuthProvider>
  </StrictMode>,
)
