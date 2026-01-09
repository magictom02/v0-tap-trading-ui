export interface PriceTick {
  price: number
  timestamp: number
}

export interface BinanceTradeEvent {
  e: string
  E: number
  s: string
  t: number
  p: string
  q: string
  T: number
  m: boolean
  M: boolean
}

type PriceCallback = (tick: PriceTick) => void
type ConnectionCallback = (connected: boolean) => void

class BinanceWebSocket {
  private ws: WebSocket | null = null
  private priceCallbacks: Set<PriceCallback> = new Set()
  private connectionCallbacks: Set<ConnectionCallback> = new Set()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 15
  private baseDelay = 1000
  private isConnecting = false
  private shouldReconnect = true
  private endpoints = [
    "wss://stream.binance.com:9443/ws/btcusdt@trade",
    "wss://stream.binance.com:443/ws/btcusdt@trade",
    "wss://fstream.binance.com/ws/btcusdt@trade",
  ]
  private currentEndpointIndex = 0

  connect() {
    if (typeof window === "undefined") return

    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return
    }

    this.isConnecting = true
    this.shouldReconnect = true

    const endpoint = this.endpoints[this.currentEndpointIndex]
    console.log("[v0] Connecting to Binance:", endpoint)

    try {
      this.ws = new WebSocket(endpoint)

      const connectionTimeout = setTimeout(() => {
        if (this.ws?.readyState !== WebSocket.OPEN) {
          console.log("[v0] Connection timeout, trying next endpoint")
          this.ws?.close()
        }
      }, 10000)

      this.ws.onopen = () => {
        clearTimeout(connectionTimeout)
        this.isConnecting = false
        this.reconnectAttempts = 0
        console.log("[v0] Connected to Binance successfully")
        this.notifyConnection(true)
      }

      this.ws.onmessage = (event) => {
        try {
          const data: BinanceTradeEvent = JSON.parse(event.data)
          if (data.e === "trade") {
            const tick: PriceTick = {
              price: Number.parseFloat(data.p),
              timestamp: data.T,
            }
            this.notifyPrice(tick)
          }
        } catch {
          // Ignore parse errors
        }
      }

      this.ws.onclose = () => {
        clearTimeout(connectionTimeout)
        this.isConnecting = false
        this.notifyConnection(false)
        console.log("[v0] WebSocket closed")
        if (this.shouldReconnect) {
          this.scheduleReconnect()
        }
      }

      this.ws.onerror = (error) => {
        clearTimeout(connectionTimeout)
        this.isConnecting = false
        console.log("[v0] WebSocket error:", error)
        this.ws?.close()
      }
    } catch (err) {
      console.log("[v0] Connection error:", err)
      this.isConnecting = false
      this.scheduleReconnect()
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("[v0] Max reconnect attempts reached")
      return
    }

    this.currentEndpointIndex = (this.currentEndpointIndex + 1) % this.endpoints.length

    const delay = Math.min(this.baseDelay * Math.pow(1.5, this.reconnectAttempts), 30000)
    this.reconnectAttempts++

    console.log(`[v0] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`)

    setTimeout(() => {
      if (this.shouldReconnect) {
        this.connect()
      }
    }, delay)
  }

  disconnect() {
    this.shouldReconnect = false
    this.ws?.close()
    this.ws = null
  }

  onPrice(callback: PriceCallback) {
    this.priceCallbacks.add(callback)
    return () => this.priceCallbacks.delete(callback)
  }

  onConnection(callback: ConnectionCallback) {
    this.connectionCallbacks.add(callback)
    return () => this.connectionCallbacks.delete(callback)
  }

  private notifyPrice(tick: PriceTick) {
    this.priceCallbacks.forEach((cb) => cb(tick))
  }

  private notifyConnection(connected: boolean) {
    this.connectionCallbacks.forEach((cb) => cb(connected))
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

let instance: BinanceWebSocket | null = null

export const binanceWS = {
  connect: () => {
    if (typeof window === "undefined") return
    if (!instance) instance = new BinanceWebSocket()
    instance.connect()
  },
  disconnect: () => instance?.disconnect(),
  onPrice: (cb: PriceCallback) => {
    if (!instance) instance = new BinanceWebSocket()
    return instance.onPrice(cb)
  },
  onConnection: (cb: ConnectionCallback) => {
    if (!instance) instance = new BinanceWebSocket()
    return instance.onConnection(cb)
  },
  isConnected: () => instance?.isConnected() ?? false,
}
