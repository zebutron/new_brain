# Setup Guide

Quick guide to get New Brain running on your machine.

## Prerequisites

- **Node.js**: v18 or higher ([Download](https://nodejs.org))
- **npm**: v9 or higher (comes with Node.js)
- **Git**: For version control

## Installation

### 1. Clone the repository (if not already done)

```bash
git clone <repository-url>
cd new_brain
```

### 2. Install dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Return to root
cd ..
```

Or use the convenience script:

```bash
npm run install:all
```

### 3. Environment Setup

Create development environment files:

```bash
# Backend environment
cat > backend/.env.dev << EOL
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EOL

# Frontend environment (if needed)
cat > frontend/.env.dev << EOL
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
EOL
```

### 4. Start the development servers

In the root directory:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend app on `http://localhost:3000`

Or start them separately:

```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend
```

## Verification

1. Open `http://localhost:3000` in your browser
2. You should see the New Brain interface
3. Check the connection status indicator (should be green/connected)
4. Try typing some Strudel code in the editor

## Troubleshooting

### Port already in use

If ports 3000 or 3001 are already in use:

```bash
# Find process using port
lsof -i :3000
lsof -i :3001

# Kill the process
kill -9 <PID>
```

Or change the ports in the environment files.

### WebSocket connection fails

- Check that backend is running
- Verify CORS settings in `backend/server.js`
- Check browser console for errors
- Ensure firewall isn't blocking WebSocket connections

### Audio not playing

- Check browser console for Web Audio API errors
- Some browsers require user interaction before audio playback
- Verify system audio settings
- Try a different browser (Chrome/Chromium recommended for Web Audio)

## Next Steps

- Read [AGENTS.md](./AGENTS.md) for AI development context
- Check [docs/STRUDEL_GUIDE.md](./docs/STRUDEL_GUIDE.md) for Strudel usage
- Explore [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for system design

## Development Tips

- Frontend auto-reloads on file changes (Vite HMR)
- Backend auto-restarts on file changes (nodemon)
- Check browser console and terminal for errors
- Use React DevTools for component debugging

