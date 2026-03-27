/**
 * Login Variant 1: "Aurora" - Animated gradient split-screen
 * Full-height left panel with flowing aurora gradient animation,
 * floating particles, and elegant typography. Right panel with
 * clean minimal form and subtle micro-interactions.
 */
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { AlertTriangle, Eye, EyeOff, Sparkles, BookOpen, Users, Award } from 'lucide-react'

export function LoginVariant1() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="flex min-h-screen" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Left: Aurora Gradient */}
      <div className="hidden w-[55%] flex-col items-center justify-center p-16 md:flex relative overflow-hidden">
        <style>{`
          @keyframes aurora { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
          @keyframes float { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
          @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 0.2; } 100% { transform: scale(0.8); opacity: 0.5; } }
          .aurora-bg { background: linear-gradient(-45deg, #0F2922, #163B32, #1E4D42, #2DB88A, #16D2DD, #163B32); background-size: 400% 400%; animation: aurora 15s ease infinite; }
        `}</style>
        <div className="aurora-bg absolute inset-0" />

        {/* Floating orbs */}
        {[1,2,3,4,5].map(i => (
          <div key={i} className="absolute rounded-full opacity-10" style={{
            width: `${40 + i * 30}px`, height: `${40 + i * 30}px`,
            background: 'radial-gradient(circle, #2DB88A, transparent)',
            top: `${10 + i * 15}%`, left: `${5 + i * 18}%`,
            animation: `float ${3 + i}s ease-in-out infinite ${i * 0.5}s`,
          }} />
        ))}

        <div className="relative z-10 text-center max-w-lg">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2">
            <Sparkles className="h-4 w-4 text-emerald-300" />
            <span className="text-sm text-emerald-200">ReDefiners World Languages</span>
          </div>

          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
            Learn Without<br />
            <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Boundaries
            </span>
          </h1>

          <p className="text-emerald-200/70 text-base mb-12 max-w-sm mx-auto">
            Unlock your potential with immersive language learning experiences designed for the modern world.
          </p>

          {/* Stats */}
          <div className="flex gap-8 justify-center">
            {[
              { icon: BookOpen, label: 'Courses', value: '50+' },
              { icon: Users, label: 'Students', value: '2,400+' },
              { icon: Award, label: 'Success Rate', value: '98%' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-2">
                  <Icon className="h-5 w-5 text-emerald-300" />
                </div>
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-xs text-emerald-300/60">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <img src={`${import.meta.env.BASE_URL}Images/logo.PNG`} alt="ReDefiners" loading="lazy" width={150} height={40} className="h-10 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-500 mt-1">Sign in to continue your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@example.com" autoComplete="email"
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-sm outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="Enter your password" autoComplete="current-password"
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-200 bg-white text-sm outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                Remember me
              </label>
              <a href="/change-password" className="text-emerald-600 hover:text-emerald-700 font-medium">Forgot password?</a>
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-emerald-900/20">
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center"><span className="bg-gray-50 px-3 text-xs text-gray-400">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {['Google', 'Microsoft', 'Apple'].map(provider => (
                <button key={provider} type="button"
                  className="h-11 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-all font-medium">
                  {provider}
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              New to ReDefiners?{' '}
              <a href="/register" className="text-emerald-600 font-semibold hover:text-emerald-700">Create account</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
