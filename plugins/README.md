# Plugins Directory

Custom audio plugins, effects, and integrations for the New Brain system.

## Structure

```
plugins/
├── effects/        # Audio effects (reverb, delay, distortion, etc.)
├── instruments/    # Virtual instruments and synths
├── integrations/   # Integrations with external tools (SuperCollider, etc.)
└── utilities/      # Helper utilities for audio processing
```

## Creating a Plugin

### Basic Plugin Template

```javascript
// plugins/effects/my-effect.js
export class MyEffect {
  constructor(audioContext) {
    this.context = audioContext
    // Initialize audio nodes here
  }

  process(input) {
    // Process audio here
    return output
  }

  setParameter(name, value) {
    // Handle parameter changes
  }
}
```

### Integration with Strudel

Plugins can be loaded and used within Strudel patterns:

```javascript
import { MyEffect } from './plugins/effects/my-effect.js'

// Use in pattern
s("bd sd").effect(new MyEffect())
```

## Guidelines

- Keep plugins modular and reusable
- Document parameters and usage
- Optimize for real-time performance
- Handle cleanup properly (prevent memory leaks)
- Test with different sample rates

