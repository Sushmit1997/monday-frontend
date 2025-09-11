import { useEffect, useState, useRef, useCallback } from 'react'
import { FactorInput } from './FactorInput'
import { RecalculateButton } from './RecalculateButton'
import { HistoryTable } from './HistoryTable'
import { AttentionBox } from './AttentionBox'
import type { CalculationHistoryEntry } from '../types/history'
import { getItemFactor, saveItemFactor, getItemHistory, recalculateItem, withRetry } from '../services/api'
import { MondayItem } from '../types/items'

type Props = {
  item: MondayItem
  onBack: () => void
}

export function ItemDetail({ item, onBack }: Props) {
  const [factor, setFactor] = useState<number>(1)
  const [history, setHistory] = useState<CalculationHistoryEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const timeoutRef = useRef<number | null>(null)
  const previousFactorRef = useRef<number>(1)

  useEffect(() => {
    if (!item) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const [factorResponse, historyResponse] = await Promise.all([
          withRetry(() => getItemFactor(Number(item.id))),
          withRetry(() => getItemHistory(Number(item.id))),
        ])
        if (!cancelled) {
          const newFactor = Number.isFinite(factorResponse.data.factor) ? factorResponse.data.factor : 1
          setFactor(newFactor)
          previousFactorRef.current = newFactor
          setHistory(historyResponse.data.history ?? [])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [item.id])



  const handleManualRecalculate = async () => {
    if (!item.id) return
    try {
      await withRetry(() => saveItemFactor(Number(item.id), factor))
      await withRetry(() => recalculateItem(Number(item.id)))
      const updated = await withRetry(() => getItemHistory(Number(item.id)))
      setHistory(updated.data.history ?? [])
    } catch {
      
    }
  }

  // Debounced effect for factor changes (excluding initial load)
  useEffect(() => {
    // Only trigger if factor actually changed (not from initial load)
    if (factor === previousFactorRef.current) return
    
    if (!item.id) return
    
    // Update the previous factor reference
    previousFactorRef.current = factor
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      handleManualRecalculate()
    }, 1000)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [factor, item.id])


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
          <AttentionBox title="Item Context" text={`Item ID: ${item.id} - ${item.name}`} type="success" />
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
