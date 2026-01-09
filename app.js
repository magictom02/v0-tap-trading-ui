const { spawn } = require("child_process")
const path = require("path")

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || "0.0.0.0"
const isDev = process.env.NODE_ENV !== "production"

console.log(`Starting Tap Trading UI in ${isDev ? "development" : "production"} mode...`)
console.log(`Server will run on http://${HOST}:${PORT}`)

// Try to use the standalone server first (production), fallback to next dev
const fs = require("fs")
const standalonePath = path.join(__dirname, ".next", "standalone", "server.js")

if (!isDev && fs.existsSync(standalonePath)) {
  // Production: Use standalone server
  process.env.PORT = PORT
  process.env.HOSTNAME = HOST
  require(standalonePath)
} else {
  // Development or no standalone build: Use next CLI
  const nextBin = path.join(__dirname, "node_modules", ".bin", "next")
  const command = isDev ? "dev" : "start"

  const child = spawn(nextBin, [command, "-p", PORT, "-H", HOST], {
    stdio: "inherit",
    cwd: __dirname,
    env: { ...process.env, PORT, HOST },
  })

  child.on("error", (err) => {
    console.error("Failed to start server:", err.message)
    process.exit(1)
  })

  child.on("exit", (code) => {
    process.exit(code || 0)
  })

  process.on("SIGINT", () => {
    child.kill("SIGINT")
  })

  process.on("SIGTERM", () => {
    child.kill("SIGTERM")
  })
}
