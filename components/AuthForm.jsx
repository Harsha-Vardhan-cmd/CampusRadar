'use client'
import { useState } from 'react'
import { auth } from '@/lib/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

export default function AuthForm({ onSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Strict UMD email validation
    const emailLower = email.toLowerCase().trim()
    if (!emailLower.endsWith('@umd.edu') && !emailLower.endsWith('@terpmail.umd.edu')) {
      setError('You must use a UMD email address (@umd.edu or @terpmail.umd.edu)')
      return
    }

    setLoading(true)

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, emailLower, password)
      } else {
        await createUserWithEmailAndPassword(auth, emailLower, password)
      }
      if (onSuccess) onSuccess()
    } catch (err) {
      // Better error messages
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try logging in instead.')
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.')
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up first.')
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format. Please use your UMD email.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isLogin ? 'Login to CampusRadar' : 'Create Account'}
      </h2>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-4 text-sm">
        ℹ️ UMD students only - use your @umd.edu or @terpmail.umd.edu email
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            UMD Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800"
            placeholder="yourname@umd.edu"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800"
            placeholder="Min 6 characters"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded font-semibold transition ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
        </button>
      </form>

      <button
        onClick={() => {
          setIsLogin(!isLogin)
          setError('')
        }}
        className="w-full mt-4 text-blue-600 hover:underline text-sm"
      >
        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
      </button>
    </div>
  )
}