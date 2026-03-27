/**
 * Login Variant 4: "Waves" - Dark theme with animated wave pattern
 * Modern dark UI with SVG wave animation at bottom, neon accent
 * colors, and sleek card design with glow effects.
 */
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { AlertTriangle, LogIn, Fingerprint } from 'lucide-react'

export function LoginVariant4() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

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

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ fontFamily: "'Inter', sans-serif", background: '#0a0e17' }}>
      <style>{`
        @keyframes wave1 { 0%,100% { d: path("M0,200 Q360,280 720,200 T1440,200 V320 H0 Z"); } 50% { d: path("M0,220 Q360,160 720,220 T1440,180 V320 H0 Z"); } }
        @keyframes wave2 { 0%,100% { d: path("M0,230 Q360,180 720,250 T1440,210 V320 H0 Z"); } 50% { d: path("M0,210 Q360,270 720,210 T1440,240 V320 H0 Z"); } }
        @keyframes glow { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        .neon-border { border: 1px solid rgba(45,184,138,0.2); box-shadow: 0 0 20px rgba(45,184,138,0.05); }
        .neon-border:focus-within { border-color: rgba(45,184,138,0.5); box-shadow: 0 0 20px rgba(45,184,138,0.15), inset 0 0 20px rgba(45,184,138,0.05); }
      `}</style>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl" style={{ animation: 'glow 6s ease-in-out infinite' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl" style={{ animation: 'glow 8s ease-in-out infinite 2s' }} />

      {/* Wave SVGs at bottom */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '200px' }}>
        <path fill="rgba(45,184,138,0.08)" style={{ animation: 'wave1 8s ease-in-out infinite' }}>
          <animate attributeName="d" dur="8s" repeatCount="indefinite"
            values="M0,200 Q360,280 720,200 T1440,200 V320 H0 Z;M0,220 Q360,160 720,220 T1440,180 V320 H0 Z;M0,200 Q360,280 720,200 T1440,200 V320 H0 Z" />
        </path>
        <path fill="rgba(22,210,221,0.05)" style={{ animation: 'wave2 10s ease-in-out infinite' }}>
          <animate attributeName="d" dur="10s" repeatCount="indefinite"
            values="M0,230 Q360,180 720,250 T1440,210 V320 H0 Z;M0,210 Q360,270 720,210 T1440,240 V320 H0 Z;M0,230 Q360,180 720,250 T1440,210 V320 H0 Z" />
        </path>
      </svg>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <Fingerprint className="h-10 w-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">ReDefiners</h1>
          <p className="text-sm text-gray-500">Secure Learning Platform</p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'rgba(15,20,30,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div className={`neon-border rounded-xl transition-all ${focused === 'email' ? 'ring-1 ring-emerald-500/20' : ''}`}>
              <label className="block px-4 pt-2 text-xs text-gray-500 font-medium">EMAIL</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                placeholder="you@redefiners.edu" autoComplete="email"
                className="w-full px-4 pb-3 bg-transparent text-white text-sm outline-none placeholder-gray-600"
              />
            </div>

            <div className={`neon-border rounded-xl transition-all ${focused === 'pass' ? 'ring-1 ring-emerald-500/20' : ''}`}>
              <label className="block px-4 pt-2 text-xs text-gray-500 font-medium">PASSWORD</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                onFocus={() => setFocused('pass')} onBlur={() => setFocused(null)}
                placeholder="Enter password" autoComplete="current-password"
                className="w-full px-4 pb-3 bg-transparent text-white text-sm outline-none placeholder-gray-600"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <input type="checkbox" className="rounded bg-transparent border-gray-700" />
                Stay signed in
              </label>
              <a href="/change-password" className="text-emerald-400 hover:text-emerald-300">Forgot password?</a>
            </div>

            <button type="submit" disabled={isSubmitting}
              className="group w-full h-12 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #2DB88A, #16D2DD)', color: '#0a0e17' }}>
              {isSubmitting ? 'Authenticating...' : (
                <><LogIn className="h-4 w-4" /> Sign In</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          New student?{' '}
          <a href="/register" className="text-emerald-400 font-medium hover:text-emerald-300">Enroll now</a>
        </p>
      </div>
    </div>
  )
}
