/**
 * Login Variant 3: "Campus" - Full-page campus image with elegant overlay
 * Large background image with dark overlay, centered white card with
 * warm typography and inviting language-learning theme.
 */
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { AlertTriangle, Globe, ChevronRight } from 'lucide-react'

export function LoginVariant3() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const result = await login(email, password)
      if (result.success) navigate('/dashboard', { replace: true })
      else setError(result.error ?? 'Login failed.')
    } catch { setError('An unexpected error occurred.') }
    finally { setIsSubmitting(false) }
  }

  const languages = ['English', 'Espanol', 'Francais', 'Deutsch', 'Italiano', 'Portugues']

  return (
    <div className="relative flex min-h-screen items-center justify-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Background */}
      <div className="absolute inset-0">
        <img src={`${import.meta.env.BASE_URL}Images/talking-class.png`} alt="" loading="lazy" width={1920} height={1080} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-emerald-950/60 to-black/80" />
      </div>

      {/* Floating language labels */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        {languages.map((lang, i) => (
          <div key={lang} className="absolute text-white/10 font-bold select-none"
            style={{ fontSize: `${20 + i * 4}px`, top: `${15 + i * 13}%`, left: `${5 + i * 14}%`, transform: `rotate(${-10 + i * 5}deg)` }}>
            {lang}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Top accent bar */}
          <div className="h-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500" />

          <div className="p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Globe className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ReDefiners</h1>
                <p className="text-xs text-gray-400">World Languages Academy</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign in to your account</h2>
            <p className="text-sm text-gray-500 mb-8">Continue your language learning journey</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="student@redefiners.edu" autoComplete="email"
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 bg-gray-50 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:shadow-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <a href="/change-password" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">Reset password</a>
                </div>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="Enter your password" autoComplete="current-password"
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 bg-gray-50 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:shadow-sm"
                />
              </div>

              <button type="submit" disabled={isSubmitting}
                className="group w-full h-12 rounded-xl bg-emerald-800 text-white font-semibold text-sm hover:bg-emerald-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-800/20 mt-2">
                {isSubmitting ? 'Signing in...' : (
                  <>Continue <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Want to start learning?{' '}
                <a href="/register" className="text-emerald-700 font-semibold hover:text-emerald-800">Take a Placement Test</a>
              </p>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-6 text-white/40 text-xs">
          <span>SSL Secured</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>FERPA Compliant</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>24/7 Support</span>
        </div>
      </div>
    </div>
  )
}
