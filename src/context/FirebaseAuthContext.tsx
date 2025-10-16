import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  AuthError
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

interface AuthContextType {
  currentUser: User | null
  loading: boolean
  loginLoading: boolean
  logoutLoading: boolean
  loginSuccess: boolean
  signup: (email: string, password: string, displayName: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (displayName: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [loginLoading, setLoginLoading] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  // Sign up function
  const signup = async (email: string, password: string, displayName: string) => {
    try {
      setLoginLoading(true)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      // Update the user's display name
      await updateProfile(result.user, { displayName })
      // Update local state
      setCurrentUser({ ...result.user, displayName } as User)
    } catch (error) {
      const authError = error as AuthError
      throw new Error(getErrorMessage(authError.code))
    } finally {
      setLoginLoading(false)
    }
  }

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoginLoading(true)
      console.log('🔐 Attempting Firebase login for:', email)
      const result = await signInWithEmailAndPassword(auth, email, password)
      console.log('✅ Firebase login successful:', result.user.uid)
    } catch (error) {
      console.error('❌ Firebase login error:', error)
      const authError = error as AuthError
      console.error('❌ Error code:', authError.code)
      console.error('❌ Error message:', authError.message)
      throw new Error(getErrorMessage(authError.code))
    } finally {
      setLoginLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      setLogoutLoading(true)
      await signOut(auth)
    } catch (error) {
      const authError = error as AuthError
      throw new Error(getErrorMessage(authError.code))
    } finally {
      setLogoutLoading(false)
    }
  }

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      const authError = error as AuthError
      throw new Error(getErrorMessage(authError.code))
    }
  }

  // Update user profile
  const updateUserProfile = async (displayName: string) => {
    if (currentUser) {
      try {
        await updateProfile(currentUser, { displayName })
        setCurrentUser({ ...currentUser, displayName } as User)
      } catch (error) {
        const authError = error as AuthError
        throw new Error(getErrorMessage(authError.code))
      }
    }
  }


  // Helper function to get user-friendly error messages
  const getErrorMessage = (errorCode: string): string => {
    console.log('🔍 Processing error code:', errorCode)
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.'
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.'
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials.'
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.'
      case 'auth/invalid-email':
        return 'Please enter a valid email address.'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.'
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.'
      case 'auth/operation-not-allowed':
        return 'Email/Password authentication is not enabled. Please contact support.'
      case 'auth/configuration-not-found':
        return 'Firebase configuration error. Please contact support.'
      default:
        return `Authentication error (${errorCode}). Please try again or contact support.`
    }
  }

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔥 Auth state changed:', user ? `User: ${user.email}` : 'No user')
      
      // If user just logged in successfully
      if (user && !currentUser && loginLoading) {
        console.log('✅ Successful login detected')
        setLoginSuccess(true)
        // Clear login success after a short delay to show the app
        setTimeout(() => {
          setLoginSuccess(false)
          setLoginLoading(false)
        }, 1500)
      } else {
        setLoginLoading(false)
      }
      
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [currentUser, loginLoading])

  const value = {
    currentUser,
    loading,
    loginLoading,
    logoutLoading,
    loginSuccess,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
