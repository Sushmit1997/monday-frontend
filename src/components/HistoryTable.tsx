import type { CalculationHistoryEntry } from '../types/history'

type Props = {
  entries: CalculationHistoryEntry[]
}

export function HistoryTable({ entries }: Props) {
  const getActionDisplay = (entry: CalculationHistoryEntry) => {
    switch (entry.action) {
      case 'recalculation':
        if (entry.metadata.error) {
          return `❌ Failed (${entry.metadata.error})`
        }
        return `🔄 Recalculated (${entry.metadata.calculation || `${entry.inputValue} × ${entry.metadata.factor} = ${entry.resultValue}`})`
      case 'factor_updated':
        return `⚙️ Factor updated (${entry.metadata.change || `${entry.oldValue} → ${entry.newValue}`})`
      default:
        return entry.action
    }
  }

  const getTriggeredByDisplay = (triggeredBy: string) => {
    return triggeredBy === 'api' ? '👤 Manual' : '🔗 Webhook'
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="text-white/70 border-b border-white/10">
            <th className="py-2 pr-4">Time</th>
            <th className="py-2 pr-4">Action</th>
            <th className="py-2 pr-4">Triggered By</th>
            <th className="py-2 pr-4">Value</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} className="border-b border-white/5">
              <td className="py-2 pr-4 whitespace-nowrap">{new Date(e.createdAt).toLocaleString()}</td>
              <td className="py-2 pr-4">{getActionDisplay(e)}</td>
              <td className="py-2 pr-4">{getTriggeredByDisplay(e.triggeredBy)}</td>
              <td className="py-2 pr-4 font-medium">
                {e.action === 'recalculation' && e.resultValue !== undefined ? e.resultValue : e.newValue}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


