import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { AuthContextUserData, AuthUser, UserProfileData } from './AuthContextTypes'
import type { AuthResponseData } from '../../shared/authTypes'

//I'm using this guide to help me, as I've never really worked with Context and auth before
// https://programmify.org/guides/getting-started-supabase-auth-complete-walkthrough/

type AuthContextType = {
  user: AuthUser | null
  loading: boolean
  signUp: (
    username: string,
    password: string,
    metadata?: AuthContextUserData
  ) => Promise<{ data: AuthResponseData | null; error: string | null }>,
  signIn: (
    username: string,
    password: string
  ) => Promise<{ data: AuthResponseData | null; error: string | null }>,
  signOut: () => Promise<void>,
}

//const AuthContext = createContext({})
const AuthContext = createContext<AuthContextType | undefined>({
  user: null,
  loading: true,
  signUp: async () => ({ data: null, error: null }),
  signIn: async () => ({ data: null, error: null }),
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const getProfileData = async (authUser: User): Promise<UserProfileData> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, username, see_adult, liked_genres, disliked_genres, watched_movies')
      //.select('*')
      //.limit(1);
      .eq('id', authUser.id)
      .maybeSingle();
    
    console.log('Profile query result:', data, error);

    if (error) {
      console.error('Error loading profile data:', error.message)
      return {
        full_name: '',
        username: '',
        see_adult: false,
        liked_genres: [],
        disliked_genres: [],
        watched_movies: [],
      }
    }

    return {
      full_name: data?.full_name || '',
      username: data?.username || '',
      see_adult: data?.see_adult === true,
      liked_genres: Array.isArray(data?.liked_genres) ? data.liked_genres : [],
      disliked_genres: Array.isArray(data?.disliked_genres) ? data.disliked_genres : [],
      watched_movies: Array.isArray(data?.watched_movies) ? data.watched_movies : [],
    }
  }

  //AI helped me with this one. I was getting an error with loading, and while it fixed that problem (removed a couple setLoading() calls in this file), it implemented this too
  const hydrateUserWithProfile = async (authUser: User | null): Promise<AuthUser | null> => {
    if (!authUser) {
      return null
    }

    const profileData = await getProfileData(authUser)
    return {
      ...authUser,
      ...profileData,
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const hydratedUser = await hydrateUserWithProfile(session?.user ?? null)
      setUser(hydratedUser)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const hydratedUser = await hydrateUserWithProfile(session?.user ?? null)
        setUser(hydratedUser)
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  // Sign up function
  const signUp = async (username: string, password: string, metadata: AuthContextUserData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: `${username}@fake.local`,
        password,
        options: {
          data: metadata
        }
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
        if (error instanceof Error) {
            return { data: null, error: error.message }
        }
      return { data: null, error: String(error) }
    }
  }

  // Sign in function
  const signIn = async (username: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${username}@fake.local`,
        password
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      if (error instanceof Error) {
        return { data: null, error: error.message }
      }
      return { data: null, error: String(error) }
    }
  }

  // Sign out function
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }

    setUser(null)
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}