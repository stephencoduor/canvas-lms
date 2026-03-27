import { useRouteError, isRouteErrorResponse } from 'react-router'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Link } from 'react-router'

export function ErrorPage() {
  const error = useRouteError()

  let title = 'Something went wrong'
  let description = 'An unexpected error occurred. Please try again.'

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Page not found'
      description = 'The page you are looking for does not exist or has been moved.'
    } else if (error.status === 403) {
      title = 'Access denied'
      description = 'You do not have permission to view this page.'
    } else if (error.status === 500) {
      title = 'Server error'
      description = 'An internal server error occurred. Please try again later.'
    }
  }

  function handleRetry() {
    window.location.reload()
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="h-10 w-10 text-red-500" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-neutral-800">{title}</h1>
      <p className="mb-8 max-w-md text-sm text-neutral-500">{description}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleRetry}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
      </div>
    </div>
  )
}
