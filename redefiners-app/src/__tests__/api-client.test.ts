import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'

// We need to test the API client's behavior
describe('API Client', () => {
  const originalFetch = globalThis.fetch
  const mockFetch = vi.fn()

  beforeEach(() => {
    globalThis.fetch = mockFetch
    mockFetch.mockReset()
  })

  afterAll(() => {
    globalThis.fetch = originalFetch
  })

  it('exists and exports functions', async () => {
    const mod = await import('@/services/api-client')
    expect(typeof mod.apiGet).toBe('function')
    expect(typeof mod.apiPost).toBe('function')
    expect(typeof mod.apiPut).toBe('function')
    expect(typeof mod.apiDelete).toBe('function')
  })

  it('apiGet calls fetch with GET method and credentials', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: 1 }),
      headers: new Headers(),
    })

    const { apiGet } = await import('@/services/api-client')
    await apiGet('/v1/users/self')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/users/self'),
      expect.objectContaining({
        method: 'GET',
        credentials: 'same-origin',
      })
    )
  })

  it('apiPost calls fetch with POST method', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: 1 }),
      headers: new Headers(),
    })

    const { apiPost } = await import('@/services/api-client')
    await apiPost('/v1/courses', { name: 'Test' })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('throws on 401 response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: () => Promise.resolve({ message: 'unauthorized' }),
    })

    const { apiGet } = await import('@/services/api-client')
    await expect(apiGet('/v1/users/self')).rejects.toThrow()
  })
})
