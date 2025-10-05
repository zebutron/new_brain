# New Brain Architecture

## System Overview

```
┌─────────────────┐         WebSocket          ┌─────────────────┐
│                 │◄──────────────────────────►│                 │
│  Frontend       │                             │   Backend       │
│  (React +       │         REST API            │   (Node.js +    │
│   Strudel)      │◄──────────────────────────►│    Express)     │
│                 │                             │                 │
└────────┬────────┘                             └─────────────────┘
         │
         │ Web Audio API
         ▼
┌─────────────────┐
│  Browser Audio  │
│  Context        │
└─────────────────┘
```

## Components

### Frontend (`/frontend`)

**Technology**: React + Vite + Strudel + Web Audio API

**Responsibilities**:
- Live code editor for Strudel patterns
- Real-time audio visualization
- Control panel for parameters and feedback
- WebSocket client for collaboration
- Audio synthesis and playback

**Key Files**:
- `App.jsx` - Main application component
- `components/StrudelEditor.jsx` - Code editor component
- `components/AudioVisualizer.jsx` - Visual feedback
- `components/ControlPanel.jsx` - Controls and feedback UI
- `hooks/useWebSocket.js` - WebSocket connection management

### Backend (`/backend`)

**Technology**: Node.js + Express + Socket.io

**Responsibilities**:
- WebSocket server for real-time sync
- Session management
- Future: Audio processing, ML integration
- Future: Recording and saving compositions

**Key Files**:
- `server.js` - Main server entry point

### Samples (`/samples`)

Audio sample library organized by category:
- `drums/` - Percussion samples
- `melodic/` - Tonal samples
- `fx/` - Effects and transitions
- `vocal/` - Vocal samples
- `custom/` - Custom recordings

### Plugins (`/plugins`)

Modular audio processing:
- `effects/` - Audio effects processors
- `instruments/` - Virtual instruments
- `integrations/` - External tool integrations
- `utilities/` - Helper functions

### Scripts (`/scripts`)

Utility scripts for automation and tooling.

## Data Flow

### Code Collaboration Flow

1. User types code in editor
2. Code change triggers local state update
3. WebSocket sends update to backend
4. Backend broadcasts to all connected clients
5. Other clients receive and sync code

### Audio Playback Flow

1. User presses play
2. Strudel evaluates code into audio patterns
3. Web Audio API schedules and plays audio
4. Visualizer renders audio data
5. User provides feedback through UI

## Real-Time Considerations

- **Latency Target**: < 50ms from code change to audio
- **Audio Buffer Size**: 512 samples (balance latency vs. stability)
- **Sample Rate**: 44.1kHz standard
- **WebSocket Throttling**: Debounce rapid code changes

## Future Extensions

- **AI Composition Engine**: ML model for generating patterns
- **Multi-user Collaboration**: Real-time co-editing
- **Recording & Export**: Save compositions as audio files
- **Plugin Marketplace**: Share and download community plugins
- **MIDI Integration**: Hardware controller support
- **DAW Integration**: Sync with external DAWs

