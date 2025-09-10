import { ChangeEvent } from 'react'

type Props = {
  value: number
  onChange: (value: number) => void
}

export function FactorInput({ value, onChange }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value)
    if (Number.isFinite(next)) onChange(next)
  }

  return (
    <label className="block">
      <span className="block mb-2 text-sm text-white/80">Multiplication factor</span>
      <input
        type="number"
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent"
        value={value}
        onChange={handleChange}
        min={0}
        step={1}
      />
    </label>
  )
}


