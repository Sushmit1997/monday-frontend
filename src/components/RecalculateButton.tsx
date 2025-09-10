type Props = {
  onClick: () => void
}

export function RecalculateButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-accent text-black font-medium hover:opacity-90 transition"
    >
      Recalculate Now
    </button>
  )
}


