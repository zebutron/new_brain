import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import { writeFile, readFile, readdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

const PORT = process.env.PORT || 3001
const PATTERNS_DIR = join(__dirname, '../patterns')
const MAX_VERSIONS = 5

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Get current code
app.get('/api/code/current', async (req, res) => {
  try {
    const code = await readFile(join(PATTERNS_DIR, 'current.js'), 'utf-8')
    res.json({ code })
  } catch (err) {
    res.status(404).json({ error: 'No current pattern' })
  }
})

// Save code with versioning
app.post('/api/code/save', async (req, res) => {
  try {
    const { code } = req.body
    
    // Save as current
    await writeFile(join(PATTERNS_DIR, 'current.js'), code, 'utf-8')
    
    // Save versioned copy
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    await writeFile(join(PATTERNS_DIR, `session-${timestamp}.js`), code, 'utf-8')
    
    // Clean up old versions (keep last MAX_VERSIONS)
    const files = await readdir(PATTERNS_DIR)
    const sessionFiles = files
      .filter(f => f.startsWith('session-'))
      .sort()
      .reverse()
    
    // Delete old ones
    for (let i = MAX_VERSIONS; i < sessionFiles.length; i++) {
      await writeFile(join(PATTERNS_DIR, sessionFiles[i]), '', 'utf-8')
    }
    
    console.log('💾 Code saved:', timestamp)
    res.json({ success: true, timestamp })
  } catch (err) {
    console.error('Save error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Store for managing AI responses (in production, use a proper message queue)
const feedbackQueue = []

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('message', (data) => {
    console.log('Received message:', data)
    
    // Broadcast to all other clients (for collaboration)
    socket.broadcast.emit('message', {
      ...data,
      fromClient: socket.id
    })
  })

  socket.on('code_update', (data) => {
    console.log('Code update from:', socket.id)
    
    // Broadcast code changes to all other clients
    socket.broadcast.emit('code_update', {
      code: data.code,
      fromClient: socket.id
    })
  })

  socket.on('feedback', (data) => {
    console.log('🎵 Feedback received:', data.feedback)
    console.log('Current code:', data.currentCode)
    
    // Store feedback for AI to process
    feedbackQueue.push({
      feedback: data.feedback,
      currentCode: data.currentCode,
      timestamp: Date.now(),
      socketId: socket.id
    })
    
    // In production, this would trigger AI processing
    // For now, just log it for Cursor AI to see
  })

  // Allow sending code updates from backend (for AI composition)
  socket.on('ai_code_update', (data) => {
    io.emit('code_update', {
      code: data.code,
      fromAI: true
    })
  })

  // Allow sending chat messages from backend (for AI responses)
  socket.on('ai_message', (data) => {
    io.emit('ai_message', {
      message: data.message,
      fromAI: true
    })
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// API endpoint to get pending feedback (for AI to poll)
app.get('/api/feedback', (req, res) => {
  res.json(feedbackQueue)
})

// API endpoint for AI to send code updates
app.post('/api/code', (req, res) => {
  const { code, message } = req.body
  
  if (code) {
    io.emit('code_update', { code, fromAI: true })
  }
  
  if (message) {
    io.emit('ai_message', { message, fromAI: true })
  }
  
  res.json({ success: true })
})

// API endpoint to clear feedback queue
app.delete('/api/feedback', (req, res) => {
  feedbackQueue.length = 0
  res.json({ success: true })
})

httpServer.listen(PORT, () => {
  console.log(`🎵 New Brain Backend running on port ${PORT}`)
  console.log(`WebSocket server ready for connections`)
})

