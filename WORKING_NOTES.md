# Working Notes

## Collaboration Workflow

1. **Human** edits code in browser editor
2. **Human** presses **Cmd+Enter** → code saves to `patterns/current.js` + timestamped version
3. **AI** reads `patterns/current.js` when iterating
4. **AI** updates code in `App.jsx` → pushes to git
5. **Human** refreshes browser to get AI's changes
6. **Repeat**

### For AI: Always Read Current Pattern
```bash
cat patterns/current.js
```

### Version History
- `patterns/current.js` - ALWAYS the latest
- `patterns/session-*.js` - Last 5 timestamped versions
- `patterns/arpeggio-foundation.js` - Saved good patterns

## What Actually Works

### Audio Engine
- `webaudioRepl()` from `@strudel/webaudio` - pre-configured REPL
- `registerSynthSounds()` - loads sawtooth, sine, square, triangle
- `transpiler` from `@strudel/transpiler` - handles Strudel mini-notation
- Global pattern functions from `@strudel/core`, `@strudel/mini`, `@strudel/tonal`

### Current Integration
```javascript
// Initialize
await initAudioOnFirstClick()
Object.assign(window, strudel, mini, tonal)
registerSynthSounds()
const repl = webaudioRepl({ transpiler })

// Play
await repl.evaluate(code)
repl.start()

// Stop  
repl.stop()
```

### Known Working Patterns
```javascript
// Synth melody
note("c1 e1 g1 c2").s("sawtooth").lpf(800)

// Layered composition
stack(
  note("c1 e1 g1 c2").s("sawtooth").lpf(800),
  note("c0*4").s("sine").lpf(200)
)
```

## Current Status

✅ **FULLY WORKING** - Making music together!

### What Works
- Synth sounds (sawtooth, sine, square, triangle)
- Basic drum samples (bd, sd, hh, cp)
- Live code editing with Cmd+Enter
- Auto-save with versioning
- Audio visualization

### Next Steps
- Load more drum samples (oh, lt, mt, ht, etc)
- Add more synth varieties
- Implement sample variation (currently all drums use first sample)

