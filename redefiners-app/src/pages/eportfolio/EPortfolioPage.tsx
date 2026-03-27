import { usePortfolios } from '@/hooks/useEPortfolio'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Briefcase, Globe, Lock, FileText } from 'lucide-react'

export function EPortfolioPage() {
  const { data: portfolios, isLoading } = usePortfolios()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">ePortfolios</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Manage your personal portfolios
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : !portfolios || portfolios.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          heading="No portfolios"
          description="You haven't created any ePortfolios yet."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              className="rounded-lg bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="rounded-lg bg-purple-50 p-2">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex items-center gap-1 text-xs text-neutral-400">
                  {portfolio.public ? (
                    <>
                      <Globe className="h-3.5 w-3.5" />
                      <span>Public</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5" />
                      <span>Private</span>
                    </>
                  )}
                </div>
              </div>
              <h4 className="text-sm font-semibold text-neutral-800">
                {portfolio.name}
              </h4>
              <p className="mt-1 text-xs text-neutral-500">
                Created{' '}
                {new Date(portfolio.created_at).toLocaleDateString()}
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-neutral-400">
                <FileText className="h-3.5 w-3.5" />
                <span>
                  Updated{' '}
                  {new Date(portfolio.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
