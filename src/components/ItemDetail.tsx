import { useEffect, useState } from 'react'
import { FactorInput } from './FactorInput'
import { RecalculateButton } from './RecalculateButton'
import { HistoryTable } from './HistoryTable'
import { AttentionBox } from '@vibe/core'
import type { CalculationHistoryEntry } from '../types/history'
import { getItemFactor, saveItemFactor, getItemHistory, recalculateItem, withRetry } from '../services/api'

type Props = {
  itemId: string
  itemName: string
  onBack: () => void
}

export function ItemDetail({ itemId, itemName, onBack }: Props) {
  const [factor, setFactor] = useState<number>(1)
  const [history, setHistory] = useState<CalculationHistoryEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!itemId) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const [factorResponse, historyResponse] = await Promise.all([
          withRetry(() => getItemFactor(Number(itemId))),
          withRetry(() => getItemHistory(Number(itemId))),
        ])
        if (!cancelled) {
          setFactor(Number.isFinite(factorResponse.data.factor) ? factorResponse.data.factor : 1)
          setHistory(historyResponse.data.history ?? [])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [itemId])



  const handleManualRecalculate = async () => {
    if (!itemId) return
    try {
      await withRetry(() => saveItemFactor(Number(itemId), factor))
      await withRetry(() => recalculateItem(Number(itemId)))
      const updated = await withRetry(() => getItemHistory(Number(itemId)))
      setHistory(updated.data.history ?? [])
    } catch {
      // logged in withRetry
    }
  }

  return (
    <div className="min-h-full grid place-items-center p-4">
      <div className="card max-w-3xl w-full p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold">Item Detail</h1>
        </div>
        
        <div className="mb-6">
          <AttentionBox title="Item Context" text={`Item ID: ${itemId} - ${itemName}`} type="success" />
        </div>
        
        <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4 mb-6">
          <div className="flex-1">
            <FactorInput value={factor} onChange={setFactor} />
          </div>
          <RecalculateButton onClick={handleManualRecalculate} />
        </div>
        
        {loading ? <div className="text-white/70">Loading…</div> : <HistoryTable entries={history} />}
      </div>
    </div>
  )
}
