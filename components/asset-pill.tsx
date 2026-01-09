"use client"

import { ChevronDown, Loader2 } from "lucide-react"

interface AssetPillProps {
  price: number | null
  isConnected: boolean
}

export function AssetPill({ price, isConnected }: AssetPillProps) {
  const formatPrice = (p: number) => {
    return p.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return (
    <div className="flex items-center gap-2 rounded-full bg-secondary/80 backdrop-blur-sm px-4 py-2 border border-border/50">
      <div className="w-6 h-6 rounded-full bg-[#F7931A] flex items-center justify-center text-xs font-bold text-black">
        ₿
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">BTC/USDT</span>
        <span className="text-sm font-mono font-semibold text-foreground">
          {isConnected && price ? `$${formatPrice(price)}` : <Loader2 className="w-4 h-4 animate-spin" />}
        </span>
      </div>
      <ChevronDown className="w-4 h-4 text-muted-foreground" />
    </div>
  )
}
