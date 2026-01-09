import Link from "next/link"
import { Bitcoin, TrendingUp, Zap, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen gradient-bg dotted-bg flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center">
            <Bitcoin className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg text-foreground">LitTap</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#how-it-works" className="hover:text-foreground transition-colors">
            How it works
          </a>
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
          Live BTC Price Feed
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground max-w-4xl leading-tight text-balance">
          Predict Bitcoin.
          <br />
          <span className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Tap to Win.
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty">
          The fastest way to trade BTC price movements. Pick a price range, choose your timeframe, and tap to place your
          bet.
        </p>

        <Link
          href="/trade"
          className="mt-10 group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-semibold text-lg shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 hover:scale-105 transition-all duration-300"
        >
          <Zap className="w-5 h-5" />
          Start Tapping
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity" />
        </Link>

        <p className="mt-4 text-xs text-muted-foreground/60">Demo simulation only • No real money</p>
      </main>

      {/* Features Section */}
      <section id="features" className="w-full max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Real-Time Data</h3>
            <p className="text-sm text-muted-foreground">
              Live BTC/USDT price feed from Binance WebSocket with instant updates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-fuchsia-400" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Instant Bets</h3>
            <p className="text-sm text-muted-foreground">
              Tap any grid tile to place a bet. Win when price hits your range.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Risk-Free Demo</h3>
            <p className="text-sm text-muted-foreground">
              Practice with virtual balance. No real money, pure learning.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full px-6 py-6 border-t border-border/50 text-center text-xs text-muted-foreground/60">
        LitTap Demo • Built for educational purposes only
      </footer>
    </div>
  )
}
