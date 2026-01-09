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
  private maxReconnectAttempts = 10
  private baseDelay = 1000
  private isConnecting = false
  private shouldReconnect = true

  connect() {
    if (typeof window === "undefined") return

    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return
    }

    this.isConnecting = true
    this.shouldReconnect = true

    try {
      this.ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade")

      this.ws.onopen = () => {
        this.isConnecting = false
        this.reconnectAttempts = 0
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
        this.isConnecting = false
        this.notifyConnection(false)
        if (this.shouldReconnect) {
          this.scheduleReconnect()
        }
      }

      this.ws.onerror = () => {
        this.isConnecting = false
        this.ws?.close()
      }
    } catch {
      this.isConnecting = false
      this.scheduleReconnect()
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return
    }

    const delay = this.baseDelay * Math.pow(2, this.reconnectAttempts)
    this.reconnectAttempts++

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
