"use client"

import { useMemo } from "react"

interface PriceAxisProps {
  currentPrice: number | null
  rows: number
  priceStep: number
}

export function PriceAxis({ currentPrice, rows, priceStep }: PriceAxisProps) {
  const priceLevels = useMemo(() => {
    if (!currentPrice) return []

    const levels: { price: number; offset: number }[] = []
    const halfRows = Math.floor(rows / 2)

    for (let i = -halfRows; i <= halfRows; i++) {
      levels.push({
        price: currentPrice + i * priceStep,
        offset: i,
      })
    }

    return levels.reverse()
  }, [currentPrice, rows, priceStep])

  if (!currentPrice) return null

  return (
    <div className="absolute right-0 top-0 bottom-0 w-20 flex flex-col justify-between py-8 pointer-events-none z-10">
      {priceLevels.map(({ price, offset }) => (
        <div key={offset} className={`flex items-center justify-end pr-2 ${offset === 0 ? "relative" : ""}`}>
          {offset === 0 ? (
            <div className="absolute right-1 rounded-lg bg-neon-pink px-2 py-1 glow-pink">
              <span className="text-xs font-mono font-bold text-white">
                ${price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
          ) : (
            <span className="text-[10px] font-mono text-muted-foreground/70">
              {price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
