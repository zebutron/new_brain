# Quick Start Guide

## Setup (One Time)

```bash
cd /Users/zebrey/Documents/GitHub/new_brain
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..
```

## Run

```bash
npm run dev
```

Opens:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

## How to Jam

### For Human:
1. Open `http://localhost:3000`
2. Click **Play** to start music
3. **Edit code** in the Strudel Live Code panel
4. Press **Cmd+Enter** to evaluate changes live
5. Give feedback to AI in Cursor chat

### For AI:
1. Check `patterns/current.js` for human's latest edits
2. Iterate on the code
3. Update `App.jsx` with new pattern
4. Commit & push
5. Tell human to refresh browser

## Strudel Basics

```javascript
// Synths
note("c4 e4 g4").s("sawtooth")

// Drums
s("bd sd bd sd")

// Layer
stack(
  note("c1").s("sine"),
  s("hh*8")
)

// Effects
.lpf(800)      // low-pass filter
.gain(0.7)     // volume
.room(0.5)     // reverb
.delay(0.4)    // delay
```

## Tips

- `~` = rest
- `*n` = repeat n times
- `<a b c>` = alternate
- `[a b]` = fast subdivision
- `.sometimes()` = randomize

