import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-50 px-4 text-center">
      <h1 className="text-6xl font-bold text-primary-700">404</h1>
      <p className="mt-4 text-xl text-neutral-600">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/dashboard"
        className="mt-8 inline-block rounded-lg bg-primary-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-800"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
