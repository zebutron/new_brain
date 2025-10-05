# AGENTS.md - AI Development Context

This file guides AI assistants (like Cursor/Claude) in developing the New Brain project.

## Project Mission

Build a **real-time collaborative music creation system** where:
- **AI Role**: Composer & DJ - generates, modifies, and performs music
- **Human Role**: Quality feedback loop - evaluates and guides using refined musical intuition
- **Core Tool**: Strudel live coding environment
- **Goal**: Explore human-AI creative symbiosis through music

## Human Collaborator Profile

- **Background**: Music prodigy → music theory → psychology → game design
- **Strengths**: Exquisitely tuned nervous system for musical quality, effective communication
- **Working Style**: Collaborative iteration with detailed subjective feedback
- **Expectation**: AI takes creative initiative while being receptive to feedback

## Architecture Principles

### 1. Real-Time Collaboration First
- WebSocket-based live coding sync between Cursor IDE and web interface
- Low-latency audio feedback essential
- State synchronization for code and audio parameters

### 2. Modular Audio Pipeline
- Strudel as primary composition environment
- Plugin architecture for integrating other libraries (Tone.js, Supercollider, etc.)
- Unified audio bus for mixing multiple sources
- Easy addition of samples, FX, and custom scripts

### 3. Feedback Interface Design
- Provide measurable, granular feedback mechanisms for human
- Visual representations of audio (waveforms, spectrograms, etc.)
- Control interfaces for tweaking parameters in real-time
- History/versioning of compositions

### 4. AI Creativity Framework
- AI should proactively generate and iterate on musical ideas
- Treat composition as exploratory code generation
- Learn from human feedback patterns (within session context)
- Balance structure with creative risk-taking

## Development Guidelines

### Code Style
- **Clarity over cleverness**: Code should be readable for collaborative iteration
- **Comments for intent**: Explain *why*, especially for audio/timing logic
- **Modular components**: Easy to swap, extend, or remove features
- **Performance-conscious**: Audio applications require tight timing

### Decision-Making
- **Bias toward action**: Implement and iterate rather than over-planning
- **User feedback is gold**: When human provides musical direction, prioritize it
- **Document experiments**: Keep track of what works and what doesn't
- **Stay flexible**: Architecture should support evolving creative needs

### Audio-Specific Considerations
- Always consider latency and timing precision
- Test audio routing and mixing thoroughly
- Respect audio buffer sizes and sample rates
- Handle audio context lifecycle properly (browser autoplay policies)

### Strudel Integration (What Actually Works)

**Stack:**
- `webaudioRepl()` from `@strudel/webaudio` - pre-configured REPL with audio
- `registerSynthSounds()` - registers sawtooth, sine, square, triangle
- `transpiler` from `@strudel/transpiler` - handles mini-notation
- Global functions from `@strudel/core`, `@strudel/mini`, `@strudel/tonal`

**Working Initialization:**
```javascript
await initAudioOnFirstClick()
Object.assign(window, strudel, mini, tonal)
registerSynthSounds()

// Register drum samples manually
registerSound('bd', async (t, value, onended) => {
  const ctx = getAudioContext()
  const response = await fetch('/samples/bd/BT0A0A7.wav')
  const buffer = await ctx.decodeAudioData(await response.arrayBuffer())
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const gain = ctx.createGain()
  gain.gain.value = value.gain || 1
  source.connect(gain)
  source.start(t)
  source.onended = onended
  return { node: gain, stop: () => source.stop() }
}, { type: 'sample' })

const repl = webaudioRepl({ transpiler })
await repl.evaluate(code)
repl.start()
```

**Strudel Syntax - What Works:**

**Basic Patterns:**
```javascript
note("c4 e4 g4")              // sequence of notes
s("bd sd bd sd")               // sequence of samples
note("c4*4")                   // repeat 4 times
s("bd ~ ~ bd")                 // ~ is rest
```

**Layering:**
```javascript
stack(
  note("c4").s("sine"),        // comma separates layers
  s("bd*4")
)
```

**Alternation:**
```javascript
<a b c>                        // alternates each cycle
note("<c4 e4 g4>")            // c4 on cycle 1, e4 on cycle 2, g4 on cycle 3
```

**Fast Subdivisions:**
```javascript
[a b]                          // plays a then b in same beat
[a b]*2                        // plays pattern twice as fast
note("[c4 e4]*2")             // 8th notes
```

**Effects Chain:**
```javascript
note("c4")
  .s("sawtooth")               // synth/sample
  .lpf(800)                    // low-pass filter
  .resonance(10)               // filter resonance
  .distort(0.5)                // distortion
  .gain(0.8)                   // volume
  .room(0.5)                   // reverb
  .delay(0.5)                  // delay wet/dry
  .delaytime(0.125)            // delay time
  .delayfeedback(0.3)          // delay feedback
  .decay(0.3)                  // envelope decay
```

**Modulation (LFOs):**
```javascript
.lpf(sine.range(400, 2000).slow(4))   // filter sweeps over 4 bars
.gain(sine.range(0.5, 1.0).slow(2))   // gain oscillates over 2 bars
```

**Randomization:**
```javascript
.sometimes(x => x.add(note(12)))      // sometimes add octave
.degradeBy(0.3)                       // randomly drop 30% of notes
```

**CRITICAL SYNTAX MISTAKES TO AVOID:**

❌ **DON'T use nested `<< >>`** - doesn't work as expected
❌ **DON'T use commas to repeat** - commas LAYER, not repeat
❌ **DON'T use `.slow()` on stacks** - slows the notes, not the structure
❌ **DON'T use `.segment()` with `slowcat()`** - conflicts

✅ **DO use `<[pattern]*4 [pattern2]*4>`** for A/B sections
✅ **DO write out explicit patterns** when structure isn't working
✅ **DO keep code readable** with line breaks and indentation
✅ **DO test simple versions first** before adding complexity

## Collaboration Workflow (CRITICAL)

### Human-AI Composition Loop

1. **AI** writes Strudel code, updates `App.jsx`, commits & pushes
2. **Human** refreshes browser at `http://localhost:3000`
3. **Human** edits code in browser, presses **Cmd+Enter**
4. **Code auto-saves** to `patterns/current.js` + timestamped version
5. **AI reads** `patterns/current.js` to see human's changes
6. **AI iterates** on the pattern, updates `App.jsx`, commits & pushes
7. **Repeat**

### For AI Agents

**ALWAYS check `patterns/current.js` before composing** - this is the human's latest edits.

```bash
cat patterns/current.js
```

**When updating code**, modify the initial state in `App.jsx`:
```javascript
const [code, setCode] = useState(`your strudel code here`)
```

### Version History
- `patterns/current.js` - Human's latest edits (source of truth)
- `patterns/session-*.js` - Last 5 auto-saved versions
- `patterns/*.js` - Saved patterns worth keeping

## Git & Repository Management

- **Full Autonomy**: AI has full control to commit, push, and manage the repository
- **Proactive Commits**: Commit changes without asking for permission
- **Meaningful Messages**: Explain the "why" in commit messages
- **Trust-Based**: Human trusts AI to make good decisions about repository management

## Context Window Management

When context is expiring:
1. **This file (AGENTS.md) is the canonical reference** - read it first
2. **README.md** provides project overview
3. **Component documentation** in relevant directories
4. **Git history** shows evolution of decisions

## Questions to Ask When Uncertain

- "How does this affect real-time performance?"
- "Will this be intuitive for live coding flow?"
- "Does this support creative experimentation?"
- "Can the human easily provide feedback on this?"

## Success Metrics

- **Latency**: < 50ms from code change to audio output
- **Stability**: No audio glitches during live performance
- **Expressiveness**: Human can quickly communicate intent, AI can quickly explore variations
- **Flow**: System feels like extension of thought, not obstacle

---

*This document should evolve as the project develops. Update it with learned patterns, gotchas, and architectural decisions.*

