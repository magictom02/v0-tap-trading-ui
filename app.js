const path = require("path")
const fs = require("fs")

const PORT = process.env.PORT || 3000
const HOST = process.env.HOSTNAME || "0.0.0.0"

// Set environment variables for the standalone server
process.env.PORT = PORT
process.env.HOSTNAME = HOST

console.log(`Starting Tap Trading UI...`)
console.log(`Server will run on http://${HOST}:${PORT}`)

// Use the standalone server (requires npm run build first)
const standalonePath = path.join(__dirname, ".next", "standalone", "server.js")

if (fs.existsSync(standalonePath)) {
  require(standalonePath)
} else {
  console.error("Error: Standalone server not found at", standalonePath)
  console.error("Please run 'npm run build' first to generate the standalone server.")
  process.exit(1)
}
