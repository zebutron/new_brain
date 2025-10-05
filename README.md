# New Brain 🎵🤖

**Human + AI Musical Symbiosis System**

Live coding music collaboration where AI composes in Strudel, human provides quality feedback.

## Quick Start

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..
npm run dev
```

Open `http://localhost:3000`

## Collaboration Flow

1. **AI** writes Strudel code → commits & pushes
2. **Human** refreshes browser (`http://localhost:3000`)
3. **Human** edits code, presses **Cmd+Enter** → auto-saves
4. **Human** gives feedback in Cursor chat
5. **AI** reads `patterns/current.js` → iterates → commits & pushes
6. **Repeat**

## What Works NOW

- ✅ **Live Strudel editor** - edit code, Cmd+Enter to evaluate
- ✅ **Auto-save** - code saves to `patterns/current.js` + versioned backups
- ✅ **Working audio** - webaudioRepl with Web Audio API
- ✅ **Synths** - sawtooth, sine, square, triangle
- ✅ **Audio visualizer** - real-time waveform
- ✅ **Drum samples** - bd, sd, hh, cp registered
- 🎵 **Making music together!**

## Philosophy

*"The human brings the nervous system. The AI brings infinite ideas. Together, we make music that neither could make alone."*

