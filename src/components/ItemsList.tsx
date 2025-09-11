import { useEffect, useState } from 'react'
import { getAllItems } from '../services/api'
import type { MondayItem } from '../types/items'

type Props = {
  onItemSelect: (item: MondayItem) => void
}

export function ItemsList({ onItemSelect }: Props) {
  const [items, setItems] = useState<MondayItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAllItems()
        if (response.success) {
          setItems(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  if (loading) {
    return (
      <div className="min-h-full grid place-items-center p-4">
        <div className="text-white/70">Loading items...</div>
      </div>
    )
  }

  return (
    <div className="min-h-full p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Monday Board Items </h1>
        <div className="grid gap-4">
          {items.map((item) => {
            const inputValue = item.column_values.find(col => col.id === 'numeric_mkvmd68j')?.text || '0'
            const resultValue = item.column_values.find(col => col.id === 'numeric_mkvn9pgw')?.text || 'Not calculated'
            
            return (
              <div
                key={item.id}
                onClick={() => onItemSelect(item)}
                className="card p-4 cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium mb-2">{item.name}</h3>
                    <div className="text-sm text-white/70">
                      <div>Input: {inputValue}</div>
                      <div>Result: {resultValue}</div>
                    </div>
                  </div>
                  <div className="text-white/50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
