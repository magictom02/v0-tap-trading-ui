"use client"

interface TileScalerProps {
  scale: number
  onScaleChange: (scale: number) => void
}

const SCALES = [0.2, 0.4, 0.6, 0.8, 1.0]

export function TileScaler({ scale, onScaleChange }: TileScalerProps) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 px-3 py-2">
      <span className="text-xs text-muted-foreground mr-1">Tile</span>
      {SCALES.map((s) => (
        <button
          key={s}
          onClick={() => onScaleChange(s)}
          className={`px-2 py-1 text-xs font-mono rounded transition-all ${
            scale === s
              ? "bg-fuchsia-500/30 text-fuchsia-300 border border-fuchsia-500/50"
              : "text-muted-foreground hover:text-white hover:bg-white/10"
          }`}
        >
          {s.toFixed(1)}%
        </button>
      ))}
    </div>
  )
}
