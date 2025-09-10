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


