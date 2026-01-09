"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { binanceWS, type PriceTick } from "@/lib/binance"
import { createBet, checkBetWin, isBetExpired, type Bet } from "@/lib/betting"
import { AssetPill } from "@/components/asset-pill"
import { BalancePill } from "@/components/balance-pill"
import { StakeSelector } from "@/components/stake-selector"
import { UnifiedChart } from "@/components/unified-chart"
import { Toast } from "@/components/toast"
import { TileScaler } from "@/components/tile-scaler"

const STAKES = [1, 5, 10]
const INITIAL_BALANCE = 68.82
const ROWS = 14
const COLS = 12
const TIME_STEP_MS = 5000 // 5 seconds per column
const HISTORY_WINDOW_MS = 60000 // 60 seconds of historical data
const MAX_HISTORY = 300

export default function TapTrading() {
  const [isConnected, setIsConnected] = useState(false)
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [priceHistory, setPriceHistory] = useState<PriceTick[]>([])
  const [balance, setBalance] = useState(INITIAL_BALANCE)
  const [stake, setStake] = useState(5)
  const [bets, setBets] = useState<Bet[]>([])
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" | "info" } | null>(null)
  const [tileScale, setTileScale] = useState(0.2)

  const betsRef = useRef(bets)
  betsRef.current = bets

  const priceStep = currentPrice ? currentPrice * (tileScale / 100) : 100

  useEffect(() => {
    const unsubPrice = binanceWS.onPrice((tick) => {
      setCurrentPrice(tick.price)
      setPriceHistory((prev) => {
        const updated = [...prev, tick]
        const cutoff = Date.now() - HISTORY_WINDOW_MS - 5000
        const filtered = updated.filter((t) => t.timestamp > cutoff)
        if (filtered.length > MAX_HISTORY) {
          return filtered.slice(-MAX_HISTORY)
        }
        return filtered
      })

      const now = Date.now()
      setBets((prevBets) => {
        let balanceChange = 0
        const updatedBets = prevBets.map((bet) => {
          if (bet.status !== "open") return bet

          if (checkBetWin(bet, tick.price, now)) {
            const winnings = bet.stake * bet.multiplier
            balanceChange += winnings
            setToast({ message: `Won $${winnings.toFixed(2)}!`, type: "success" })
            return { ...bet, status: "won" as const, hitAt: now }
          }

          if (isBetExpired(bet)) {
            return { ...bet, status: "lost" as const }
          }

          return bet
        })

        if (balanceChange > 0) {
          setBalance((prev) => prev + balanceChange)
        }

        return updatedBets
      })
    })

    const unsubConnection = binanceWS.onConnection(setIsConnected)

    binanceWS.connect()

    return () => {
      unsubPrice()
      unsubConnection()
      binanceWS.disconnect()
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setBets((prevBets) =>
        prevBets.map((bet) => {
          if (bet.status === "open" && isBetExpired(bet)) {
            return { ...bet, status: "lost" as const }
          }
          return bet
        }),
      )
    }, 500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setBets((prevBets) =>
        prevBets.filter((bet) => {
          if (bet.status === "open") return true
          return now - bet.expiresAt < 30000
        }),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleCellClick = useCallback(
    (
      row: number,
      col: number,
      priceMin: number,
      priceMax: number,
      expiresAt: number,
      betStartTime: number,
      multiplier: number,
      absolutePrice: number,
    ) => {
      if (balance < stake) {
        setToast({ message: "Insufficient balance", type: "error" })
        return
      }

      const existingBet = betsRef.current.find(
        (b) =>
          b.betStartTime === betStartTime &&
          Math.abs((b.priceMin + b.priceMax) / 2 - absolutePrice) < priceStep / 2 &&
          b.status === "open",
      )
      if (existingBet) {
        setToast({ message: "Bet already placed here", type: "info" })
        return
      }

      const bet = createBet(stake, multiplier, priceMin, priceMax, expiresAt, betStartTime, row, col)
      setBalance((prev) => prev - stake)
      setBets((prev) => [...prev, bet])
    },
    [balance, stake, priceStep],
  )

  return (
    <div className="fixed inset-0 overflow-hidden gradient-bg dotted-bg">
      <div className="absolute top-4 left-4 z-20">
        <AssetPill price={currentPrice} isConnected={isConnected} />
      </div>

      <div className="absolute bottom-4 left-4 z-20">
        <BalancePill balance={balance} />
      </div>

      <div className="absolute bottom-4 right-4 z-20">
        <StakeSelector stake={stake} stakes={STAKES} onStakeChange={setStake} />
      </div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <TileScaler scale={tileScale} onScaleChange={setTileScale} />
      </div>

      <div className="absolute top-4 right-4 z-20">
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
            isConnected ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
          {isConnected ? "Live" : "Connecting..."}
        </div>
      </div>

      <div className="h-full w-full pt-16 pb-16 px-4">
        <UnifiedChart
          priceHistory={priceHistory}
          currentPrice={currentPrice}
          rows={ROWS}
          cols={COLS}
          priceStep={priceStep}
          timeStepMs={TIME_STEP_MS}
          historyWindowMs={HISTORY_WINDOW_MS}
          bets={bets}
          onCellClick={handleCellClick}
        />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground/50 z-10">
        Demo simulation only • No real money
      </div>
    </div>
  )
}
