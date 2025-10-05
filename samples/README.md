# Samples Directory

Store audio samples here for use in Strudel and other audio libraries.

## Organization

```
samples/
├── drums/          # Drum samples (kicks, snares, hats, etc.)
├── melodic/        # Melodic samples (synths, keys, etc.)
├── fx/             # Sound effects and transitions
├── vocal/          # Vocal samples and chops
└── custom/         # Your custom recordings
```

## Supported Formats

- `.wav` (preferred for quality)
- `.mp3` (smaller file size)
- `.ogg` (web-optimized)

## Usage in Strudel

```javascript
// Load a sample
s("bd") // Built-in bass drum
s("samples/drums/kick.wav") // Your custom sample
```

## Notes

- Large sample files (`.wav`, `.mp3`, `.flac`) are gitignored
- Keep samples organized by category
- Consider sample rate (44.1kHz or 48kHz recommended)
- Trim silence from beginning/end for better timing

