import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth'
import { auth } from './firebase'

// Admin credentials from environment
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'dsharma.workmain@gmail.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''

// Sign in admin user
export const signInAdmin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

// Sign out current user
export const signOut = async () => {
  try {
    await firebaseSignOut(auth)
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Check if user is admin
export const isAdmin = (user: User | null): boolean => {
  return user?.email === ADMIN_EMAIL
}

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser
}