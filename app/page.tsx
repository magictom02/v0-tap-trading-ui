import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="fixed inset-0 overflow-hidden gradient-bg dotted-bg flex flex-col items-center justify-center">
      {/* Hero content */}
      <div className="flex flex-col items-center gap-8 text-center px-6 max-w-2xl">
        {/* Logo/Title */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-2 shadow-lg shadow-purple-500/30">
            <span className="text-2xl font-bold text-white">T</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Tap Trading
          </h1>
          <p className="text-muted-foreground text-lg">Predict BTC price movements in real-time</p>
        </div>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Binance Data
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            Instant Bets
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            Demo Mode
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/trade"
          className="group relative mt-4 px-10 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30"
        >
          <span className="relative z-10">Start Tapping</span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
        </Link>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground/50 mt-8">Demo simulation only - No real money involved</p>
      </div>
    </div>
  )
}
