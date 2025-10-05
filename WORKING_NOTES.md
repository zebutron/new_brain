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

## What Doesn't Work Yet

- **Sample loading** - bd, sd, hh not loaded (samples are downloaded but not registered)
- **WebSocket sync** - removed for simplicity, will add back later
- **Chat interface** - feedback via Cursor chat for now

## To Fix Next

1. Register Dirt-Samples from `/public/samples/` directory
2. Add sample loading configuration  
3. Test drum patterns with `sound("bd sd")`

