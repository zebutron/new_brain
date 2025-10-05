#!/usr/bin/env node
/**
 * Helper script for AI to send code updates and messages to the frontend
 * Usage: node scripts/send_code.js --code "sound('bd sd')" --message "Added a beat!"
 */

import { io } from 'socket.io-client'

const WS_URL = process.env.WS_URL || 'ws://localhost:3001'

// Parse command line arguments
const args = process.argv.slice(2)
let code = null
let message = null

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--code' && args[i + 1]) {
    code = args[i + 1]
    i++
  } else if (args[i] === '--message' && args[i + 1]) {
    message = args[i + 1]
    i++
  }
}

if (!code && !message) {
  console.error('Usage: node send_code.js --code "your code" --message "your message"')
  process.exit(1)
}

// Connect to WebSocket server
const socket = io(WS_URL, {
  transports: ['websocket'],
  reconnection: false
})

socket.on('connect', () => {
  console.log('✅ Connected to backend')
  
  if (code) {
    console.log('📝 Sending code update...')
    socket.emit('ai_code_update', { code })
  }
  
  if (message) {
    console.log('💬 Sending message...')
    socket.emit('ai_message', { message })
  }
  
  // Give it a moment to send, then disconnect
  setTimeout(() => {
    socket.close()
    console.log('✨ Done!')
    process.exit(0)
  }, 500)
})

socket.on('connect_error', (err) => {
  console.error('❌ Connection error:', err.message)
  process.exit(1)
})

