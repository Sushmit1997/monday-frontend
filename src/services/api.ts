import axios from 'axios'
import type { ItemsResponse } from '../types/items'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
})

// Request deduplication for development
const pendingRequests = new Map<string, Promise<any>>()

const deduplicateRequest = (key: string, requestFn: () => Promise<any>) => {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!
  }
  
  const promise = requestFn().finally(() => {
    pendingRequests.delete(key)
  })
  
  pendingRequests.set(key, promise)
  return promise
}


export async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, 500 * (i + 1)))
    }
  }
  // eslint-disable-next-line no-console
  console.error('API call failed after retries:', lastErr)
  throw lastErr as any
}

export async function getItemFactor(itemId: number) {
  console.log('getItemFactor', apiClient.defaults.baseURL)
  const { data } = await apiClient.get(`/items/${itemId}/factor`)
  return data as { success: boolean; data: { itemId: string; factor: number } }
}

export async function saveItemFactor(itemId: number, factor: number) {
  const { data } = await apiClient.post(`/items/${itemId}/factor`, { factor })
  return data as { success: boolean; data: { itemId: string; oldFactor: number; newFactor: number } }
}

export async function recalculateItem(itemId: number) {
  const { data } = await apiClient.post(`/items/${itemId}/recalculate`)
  return data as { success: boolean; data: { itemId: string; inputValue: number; factor: number; resultValue: number } }
}

export type CalculationHistoryEntry = {
  id: string
  itemId: string
  action: 'recalculation' | 'factor_updated'
  newValue: number
  oldValue?: number | null
  inputValue?: number
  resultValue?: number
  triggeredBy: 'api' | 'webhook'
  metadata: {
    factor?: number
    calculation?: string
    change?: string
    error?: string
    errorType?: string
  }
  createdAt: string
  updatedAt: string
}

export async function getItemHistory(itemId: number) {
  const { data } = await apiClient.get(`/items/${itemId}/history`)
  return data as { success: boolean; data: { itemId: string; history: CalculationHistoryEntry[]; count: number } }
}

export async function getAllItems() {
  return deduplicateRequest('getAllItems', async () => {
    const { data } = await apiClient.get('/items')
    return data as ItemsResponse
  })
}


