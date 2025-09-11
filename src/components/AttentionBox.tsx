import React from 'react'

type AttentionBoxProps = {
  title: string
  text: string
  type: 'success' | 'info' | 'warning' | 'error'
}

export function AttentionBox({ title, text, type }: AttentionBoxProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20 text-green-400'
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
      case 'error':
        return 'bg-red-500/10 border-red-500/20 text-red-400'
      default:
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400'
    }
  }

  return (
    <div className={`p-4 rounded-lg border ${getTypeStyles()}`}>
      <h3 className="font-semibold text-sm mb-1">{title}</h3>
      <p className="text-sm opacity-90">{text}</p>
    </div>
  )
}
