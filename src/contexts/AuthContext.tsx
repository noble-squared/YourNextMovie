import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { AuthContextUserData } from './AuthContextTypes'
import type { AuthResponseData } from '../../shared/authTypes'

//I'm using this guide to help me, as I've never really worked with Context and auth before
// https://programmify.org/guides/getting-started-supabase-auth-complete-walkthrough/

type AuthContextType = {
  user: User | null
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
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  // Sign up function
  const signUp = async (username: string, password: string, metadata: AuthContextUserData = {}) => {
    try {
      setLoading(true)

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
    } finally {
      setLoading(false)
    }
  }

  // Sign in function
  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error signing out:', error.message)
      } else {
        console.error('Error signing out:', error)
      }
    } finally {
      setLoading(false)
    }
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