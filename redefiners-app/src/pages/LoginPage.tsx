import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { AlertTriangle } from 'lucide-react'
import { LoginVariant1, LoginVariant2, LoginVariant3, LoginVariant4, LoginVariant5 } from './login'

const LOGIN_VARIANTS: Record<string, React.ComponentType> = {
  default: LoginVariant1,
  aurora: LoginVariant1,
  glass: LoginVariant2,
  campus: LoginVariant3,
  waves: LoginVariant4,
  mosaic: LoginVariant5,
}

export function LoginPage() {
  const variant = localStorage.getItem('redefiners-login-variant') ?? 'default'
  const Component = LOGIN_VARIANTS[variant] ?? LoginPageDefault
  return <Component />
}

function LoginPageDefault() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await login(email, password)
      if (result.success) {
        navigate('/dashboard', { replace: true })
      } else {
        setError(result.error ?? 'Login failed. Please try again.')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Left Panel - Teal Branding */}
      <div
        className="hidden w-1/2 flex-col items-center justify-center gap-6 p-10 md:flex"
        style={{
          background: 'linear-gradient(180deg, #163B32 0%, #0F2922 100%)',
          borderRadius: '0 40px 0 0',
        }}
      >
        <h1 className="text-center font-bold text-white" style={{ fontSize: '3.5rem' }}>
          Welcome
        </h1>
        <h1 className="text-center font-bold" style={{ fontSize: '28px', color: '#4A8B7A' }}>
          Bienvenidos
        </h1>
        <h5 className="text-center font-normal" style={{ fontSize: '14px', color: '#4A8B7A' }}>
          Enter your details to login or
          <br />
          take a{' '}
          <a href="#" className="hover:underline" style={{ color: '#4A8B7A' }}>
            Placement Test
          </a>
        </h5>
        <div className="mt-6 flex gap-4">
          <img src={`${import.meta.env.BASE_URL}Images/login1.png`} alt="" loading="lazy" width={120} height={120} />
          <img src={`${import.meta.env.BASE_URL}Images/login2.png`} alt="" loading="lazy" width={120} height={120} />
          <img src={`${import.meta.env.BASE_URL}Images/login3.png`} alt="" loading="lazy" width={120} height={120} />
          <img src={`${import.meta.env.BASE_URL}Images/login4.png`} alt="" loading="lazy" width={120} height={120} />
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-12">
        <div className="w-full" style={{ maxWidth: '380px' }}>
          <img
            src={`${import.meta.env.BASE_URL}Images/logo.PNG`}
            alt="ReDefiners"
            loading="lazy"
            width={150}
            height={40}
            className="mb-8"
            style={{ height: '40px' }}
          />

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label
                className="font-medium"
                style={{ fontSize: '13px', color: '#0F2922' }}
              >
                Your E-mail
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="shadcn-input"
                style={{ height: '44px' }}
              />
            </div>

            <div className="space-y-1.5">
              <label
                className="font-medium"
                style={{ fontSize: '13px', color: '#0F2922' }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="shadcn-input"
                style={{ height: '44px' }}
              />
            </div>

            <div className="flex items-center gap-2" style={{ fontSize: '13px' }}>
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="remember" style={{ color: '#4A8B7A' }}>
                Keep me logged in
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-semibold text-white"
              style={{
                height: '44px',
                background: '#163B32',
                borderRadius: '9999px',
                border: 'none',
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
                transition: 'background 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isSubmitting ? 0.5 : 1,
              }}
              onMouseOver={(e) => {
                if (!isSubmitting) (e.currentTarget.style.background = '#0F2922')
              }}
              onMouseOut={(e) => {
                if (!isSubmitting) (e.currentTarget.style.background = '#163B32')
              }}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="flex-1" style={{ height: '1px', background: '#C4CDD5' }} />
            <span className="font-semibold" style={{ fontSize: '12px', color: '#4A8B7A' }}>
              OR
            </span>
            <div className="flex-1" style={{ height: '1px', background: '#C4CDD5' }} />
          </div>

          {/* Google OAuth */}
          <button
            className="w-full gap-2"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              borderRadius: '9999px',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              padding: '8px 16px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: '#FFFFFF',
              color: '#163B32',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
              height: '44px',
            }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Login With Google
          </button>

          <p className="mt-6 text-center" style={{ fontSize: '12px', color: '#4A8B7A' }}>
            Don&apos;t have an account?{' '}
            <a
              href="#"
              className="font-semibold hover:underline"
              style={{ color: '#0F2922' }}
            >
              Sign up
            </a>
          </p>
          <p className="mt-2 text-center" style={{ fontSize: '12px' }}>
            <a
              href="#"
              className="font-semibold hover:underline"
              style={{ color: '#0F2922' }}
            >
              Forgot Password
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
