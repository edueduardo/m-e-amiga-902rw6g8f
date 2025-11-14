import { createContext, useState, ReactNode, useMemo, useCallback } from 'react'
import { UserProfile } from '@/types'
import { getOrAssignABTestGroup, ABTestGroup } from '@/lib/abTesting'

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  isSubscribed: boolean
  abTestGroup: ABTestGroup | null
  login: (user: UserProfile, isSubscribed: boolean) => void
  logout: () => void
  updateUser: (data: Partial<UserProfile>) => void
  subscribe: () => void
  requestPhoneEmailVerification: () => string
  confirmPhoneEmailVerification: (token: string) => boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data
const mockUser: UserProfile = {
  id: '123',
  full_name: 'Maria',
  email: 'maria@example.com',
  is_email_verified: true,
  phone_number: '+55 11999998888',
  phone_verification_status: 'not_verified',
  is_two_factor_enabled: false,
}

// Mock a verification token store
const mockVerificationStore: { [key: string]: string } = {}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [abTestGroup, setAbTestGroup] = useState<ABTestGroup | null>(null)

  const login = useCallback((userData: UserProfile, subscribed: boolean) => {
    setUser(userData)
    setIsSubscribed(subscribed)
    setAbTestGroup(getOrAssignABTestGroup())
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setIsSubscribed(false)
    setAbTestGroup(null)
  }, [])

  const updateUser = useCallback((data: Partial<UserProfile>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...data } : null))
  }, [])

  const subscribe = useCallback(() => {
    if (user) {
      setIsSubscribed(true)
    }
  }, [user])

  const requestPhoneEmailVerification = useCallback(() => {
    if (!user) return ''
    const token = `mock_token_${Date.now()}`
    mockVerificationStore[token] = user.id
    updateUser({ phone_verification_status: 'pending_email' })
    console.log(
      `Verification email sent to ${user.email} for phone ${user.phone_number}. Token: ${token}`,
    )
    return token
  }, [user, updateUser])

  const confirmPhoneEmailVerification = useCallback(
    (token: string) => {
      if (user && mockVerificationStore[token] === user.id) {
        updateUser({ phone_verification_status: 'verified' })
        delete mockVerificationStore[token]
        return true
      }
      return false
    },
    [user, updateUser],
  )

  // For development: auto-login with a mock user
  useMemo(() => {
    // login(mockUser, true); // auto-login with active subscription
    // login(mockUser, false); // auto-login with inactive subscription
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isSubscribed,
      abTestGroup,
      login,
      logout,
      updateUser,
      subscribe,
      requestPhoneEmailVerification,
      confirmPhoneEmailVerification,
    }),
    [
      user,
      isSubscribed,
      abTestGroup,
      login,
      logout,
      updateUser,
      subscribe,
      requestPhoneEmailVerification,
      confirmPhoneEmailVerification,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
