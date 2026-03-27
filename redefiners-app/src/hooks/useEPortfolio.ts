import { useQuery } from '@tanstack/react-query'
import { listPortfolios, getPortfolio, getPortfolioPages } from '@/services/modules/eportfolio'
import type { CanvasEPortfolio, CanvasEPortfolioPage } from '@/services/modules/eportfolio'

export function usePortfolios() {
  return useQuery<CanvasEPortfolio[]>({
    queryKey: ['eportfolios'],
    queryFn: async () => {
      const response = await listPortfolios()
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function usePortfolio(id: number | string) {
  return useQuery<CanvasEPortfolio>({
    queryKey: ['eportfolios', id],
    queryFn: async () => {
      const response = await getPortfolio(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function usePortfolioPages(id: number | string) {
  return useQuery<CanvasEPortfolioPage[]>({
    queryKey: ['eportfolios', id, 'pages'],
    queryFn: async () => {
      const response = await getPortfolioPages(id)
      return response.data
    },
    enabled: !!id,
  })
}
