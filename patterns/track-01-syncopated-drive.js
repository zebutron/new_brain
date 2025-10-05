// TRACK 01: Syncopated Drive
// Upbeat industrial with funky hats and soaring melody
// Created: 2025-10-05

stack(
  note("c1 e1 g1 c2 e1 g1 c2 e1")
    .s("sawtooth")
    .lpf(400)
    .room(0.5)
    .gain(0.7)
    .sometimes(x => x.add(note(12))),
  s("bd*4, ~ sd ~ <sd sd sd [sd ~ ~ sd]>")
    .gain(1.2),
  s("<[hh ~ hh ~] [~ [hh hh] ~ hh] [hh ~ ~ [hh ~ hh ~]] [~ hh [hh ~ hh] ~]>")
    .gain(0.7),
  s("~ ~ ~ cp")
    .gain(0.9)
    .delay(0.4)
    .delayfeedback(0.3),
  note("<[e5 ~ ~ e5] [g5 ~ a5 ~] [~ c6 ~ b5] [a5 ~ g5 e5]>")
    .s("square")
    .lpf(5000)
    .decay(0.15)
    .gain(0.7)
    .delay(0.4)
    .delaytime(0.0833)
    .delayfeedback(0.25)
)

