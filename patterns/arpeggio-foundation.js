// SAVED PATTERN: Arpeggio Foundation
// Working synth layers with good feel
// Date: 2025-10-05

stack(
  note("c1 e1 g1 c2 e1 g1 c2 e1").s("sawtooth").lpf(400).room(0.5).gain(0.7),
  note("<[c4 e4 g4] [~ ~ c5] ~!2>").s("square").lpf(4000).decay(0.06).gain(0.6).delay(0.5).delaytime(0.125).delayfeedback(0.4).sometimes(x=>x.add(note(rand.range(-12,12))))
)

