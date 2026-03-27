/**
 * Login Variant 2: "Glass" - Glassmorphism card on animated mesh gradient
 * Centered frosted-glass card floating over a colorful mesh gradient.
 * Smooth hover effects, glowing input focus states, and modern feel.
 */
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { AlertTriangle, Mail, Lock, ArrowRight } from 'lucide-react'

export function LoginVariant2() {
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

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes mesh { 0%,100% { background-position: 0% 50%; } 25% { background-position: 100% 0%; } 50% { background-position: 100% 100%; } 75% { background-position: 0% 100%; } }
        .mesh-bg { background: linear-gradient(-45deg, #0F2922, #163B32, #2DB88A, #16D2DD, #1E4D42, #3B82F6, #163B32); background-size: 600% 600%; animation: mesh 20s ease infinite; }
        .glass { background: rgba(255,255,255,0.12); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.18); }
        .glow-input:focus { box-shadow: 0 0 0 3px rgba(45,184,138,0.3), inset 0 0 0 1px rgba(45,184,138,0.5); }
      `}</style>

      {/* Mesh gradient background */}
      <div className="mesh-bg absolute inset-0" />

      {/* Decorative circles */}
      <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-3xl" />

      {/* Glass card */}
      <div className="glass relative z-10 w-full max-w-md rounded-3xl p-10 shadow-2xl mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 shadow-lg">
            <img src={`${import.meta.env.BASE_URL}Images/logo.PNG`} alt="R" loading="lazy" width={120} height={32} className="h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Welcome Back</h1>
          <p className="text-sm text-white/50">Sign in to your ReDefiners account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-500/20 border border-red-400/30 px-4 py-3 text-sm text-red-200">
              <AlertTriangle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="Email address" autoComplete="email"
              className="glow-input w-full h-13 pl-12 pr-4 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder-white/30 outline-none transition-all"
              style={{ height: 52 }}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="Password" autoComplete="current-password"
              className="glow-input w-full h-13 pl-12 pr-4 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder-white/30 outline-none transition-all"
              style={{ height: 52 }}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-white/50 cursor-pointer">
              <input type="checkbox" className="rounded bg-white/10 border-white/20" />
              Remember me
            </label>
            <a href="/change-password" className="text-emerald-300 hover:text-emerald-200 transition-colors">Forgot?</a>
          </div>

          <button type="submit" disabled={isSubmitting}
            className="group w-full h-13 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm hover:from-emerald-400 hover:to-teal-400 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
            style={{ height: 52 }}>
            {isSubmitting ? 'Signing in...' : (
              <>Sign In <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>

          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="h-11 rounded-xl bg-white/8 border border-white/10 text-sm text-white/70 hover:bg-white/15 transition-all flex items-center justify-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/></svg>
              Google
            </button>
            <button type="button" className="h-11 rounded-xl bg-white/8 border border-white/10 text-sm text-white/70 hover:bg-white/15 transition-all flex items-center justify-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M11.4 24H1.6C.7 24 0 23.3 0 22.4V1.6C0 .7.7 0 1.6 0h20.8c.9 0 1.6.7 1.6 1.6v20.8c0 .9-.7 1.6-1.6 1.6h-5.5v-9.3h3.1l.5-3.6h-3.6V8.7c0-1 .3-1.7 1.8-1.7h1.9V3.7c-.3 0-1.5-.1-2.8-.1-2.8 0-4.7 1.7-4.7 4.8v2.7H9.8v3.6h2.6V24z"/></svg>
              SSO Login
            </button>
          </div>

          <p className="text-center text-sm text-white/40 mt-6">
            First time here?{' '}
            <a href="/register" className="text-emerald-300 font-medium hover:text-emerald-200">Create account</a>
          </p>
        </form>
      </div>
    </div>
  )
}
