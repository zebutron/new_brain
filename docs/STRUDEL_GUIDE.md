# Strudel Guide for New Brain

## What is Strudel?

Strudel is a live coding environment for creating music with code. It's a JavaScript port of TidalCycles, bringing pattern-based music composition to the browser.

## Basic Patterns

```javascript
// Simple beat
sound("bd sd")

// With timing
sound("bd sd").fast(2)

// Layering
stack(
  sound("bd sd"),
  sound("~ oh").late(0.5)
)
```

## Integration with New Brain

In the New Brain system, Strudel patterns are:
1. Written in the live code editor
2. Evaluated in real-time
3. Synchronized across the WebSocket connection
4. Mixed with other audio sources

## AI Composition Patterns

When generating Strudel code, consider:
- **Rhythm**: Start with solid rhythmic foundation
- **Layering**: Build complexity gradually
- **Variation**: Use randomness and transformation functions
- **Structure**: Create clear sections and transitions

## Example Session

```javascript
// Start with drums
sound("bd sd bd sd")

// Add hi-hats
stack(
  sound("bd sd bd sd"),
  sound("hh*8").gain(0.3)
)

// Add melody
stack(
  sound("bd sd bd sd"),
  sound("hh*8").gain(0.3),
  note("c3 e3 g3 c4").sound("sawtooth").lpf(800)
)
```

## Resources

- [Strudel Official Documentation](https://strudel.cc)
- [TidalCycles Documentation](https://tidalcycles.org) (pattern concepts apply)
- [Pattern Reference](https://strudel.cc/learn) (functions and modifiers)

