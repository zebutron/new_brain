stack(
  note("f2 ~ [f2 f2] ~, ~ ~ [f2 ab2] ~, f2 ~ f2 ~, ~ [f2 c3] ~ f2")
    .s("sawtooth")
    .lpf(1200)
    .resonance(8)
    .distort(0.6)
    .room(0.2)
    .decay(0.15)
    .gain(1.1),
  s("bd*4, ~ sd ~ sd, [[hh hh]hh]*4")
    .gain(1.3)
    .room(0.3),
  s("~ ~ cp ~")
    .gain(1.0)
    .delay(0.25)
    .delaytime(0.125),
  note("<[c5 eb5 f5] [f5 ab5 c6]>")
    .s("square")
    .lpf(6000)
    .decay(0.08)
    .gain(0.7)
)