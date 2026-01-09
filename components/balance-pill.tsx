"use client"

import { Wallet } from "lucide-react"

interface BalancePillProps {
  balance: number
}

export function BalancePill({ balance }: BalancePillProps) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-secondary/80 backdrop-blur-sm px-4 py-2 border border-border/50">
      <Wallet className="w-4 h-4 text-neon-lime" />
      <span className="text-sm font-mono font-semibold text-foreground">${balance.toFixed(2)}</span>
    </div>
  )
}
