/**
 * Login Variant 5: "Mosaic" - Asymmetric layout with image mosaic
 * Left side has a mosaic of student/classroom images in a creative grid.
 * Right side has a warm, inviting form with testimonial carousel.
 */
import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { AlertTriangle, Star, Quote } from 'lucide-react'

export function LoginVariant5() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testimonialIdx, setTestimonialIdx] = useState(0)

  const testimonials = [
    { name: 'Aisha Johnson', role: 'Spanish Student', text: 'ReDefiners completely transformed how I learn languages. The interactive approach keeps me engaged every day.' },
    { name: 'Carlos Rivera', role: 'Biology Student', text: 'The platform is intuitive and the instructors are world-class. I have improved my grades significantly.' },
    { name: 'Emily Chen', role: 'CS Student', text: 'I love the collaborative features. Study groups and live chat make learning feel like a community.' },
  ]

  useEffect(() => {
    const timer = setInterval(() => setTestimonialIdx(i => (i + 1) % testimonials.length), 5000)
    return () => clearInterval(timer)
  }, [])

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

  const B = import.meta.env.BASE_URL

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Left: Image Mosaic */}
      <div className="hidden w-[50%] bg-emerald-900 p-6 md:flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <img src={`${B}Images/logo.PNG`} alt="ReDefiners" loading="lazy" width={120} height={32} className="h-8 brightness-0 invert" />
        </div>

        <div className="flex-1 grid grid-cols-3 grid-rows-3 gap-3 rounded-3xl overflow-hidden">
          <div className="row-span-2 rounded-2xl overflow-hidden">
            <img src={`${B}Images/login1.png`} alt="" loading="lazy" width={300} height={400} className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img src={`${B}Images/login2.png`} alt="" loading="lazy" width={300} height={200} className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center p-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">50+</p>
              <p className="text-xs text-white/70">Courses Available</p>
            </div>
          </div>
          <div className="col-span-2 rounded-2xl overflow-hidden">
            <img src={`${B}Images/talking-class.png`} alt="" loading="lazy" width={600} height={200} className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img src={`${B}Images/login3.png`} alt="" loading="lazy" width={300} height={200} className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center p-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">4.9</p>
              <div className="flex justify-center mt-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 text-white fill-white" />)}
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img src={`${B}Images/login4.png`} alt="" loading="lazy" width={300} height={200} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 flex-col justify-center bg-white px-8 py-12 md:px-16">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Platform Online
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Log in to your account</h1>
            <p className="text-gray-500 text-sm">Access your courses, assignments, and learning materials.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@redefiners.edu" autoComplete="email"
                className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 text-sm outline-none transition-all focus:border-emerald-500 focus:shadow-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="Enter your password" autoComplete="current-password"
                className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 text-sm outline-none transition-all focus:border-emerald-500 focus:shadow-sm"
              />
            </div>

            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-emerald-600" />
                Remember me
              </label>
              <a href="/change-password" className="text-emerald-600 font-medium hover:text-emerald-700">Forgot password?</a>
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 disabled:opacity-60 transition-all mt-2">
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-center text-sm text-gray-400 mt-4">
              Don't have an account?{' '}
              <a href="/register" className="text-emerald-600 font-semibold hover:text-emerald-700">Sign up free</a>
            </p>
          </form>

          {/* Testimonial */}
          <div className="mt-12 p-5 rounded-2xl bg-gray-50 border border-gray-100">
            <Quote className="h-5 w-5 text-emerald-300 mb-2" />
            <p className="text-sm text-gray-600 italic mb-3">{testimonials[testimonialIdx].text}</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-xs font-bold text-emerald-700">
                  {testimonials[testimonialIdx].name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">{testimonials[testimonialIdx].name}</p>
                <p className="text-xs text-gray-400">{testimonials[testimonialIdx].role}</p>
              </div>
            </div>
            <div className="flex gap-1 mt-3">
              {testimonials.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all ${i === testimonialIdx ? 'w-6 bg-emerald-500' : 'w-2 bg-gray-200'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
