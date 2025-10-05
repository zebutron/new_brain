import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'

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

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

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

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

httpServer.listen(PORT, () => {
  console.log(`🎵 New Brain Backend running on port ${PORT}`)
  console.log(`WebSocket server ready for connections`)
})

