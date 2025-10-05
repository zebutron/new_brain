stack(
  note("c1 e1 g1 c2 e1 g1 c2 e1")
    .s("sawtooth")
    .lpf(400)
    .room(0.5)
    .gain(0.7)
    .sometimes(x => x.add(note(12))),
  s("bd*4, ~ sd ~ <sd sd sd [sd ~ ~ sd]>")
    .gain(1.2),
  s("<[hh ~ hh ~] [~ hh ~ hh] [hh ~ ~ hh] [~ ~ hh hh]>")
    .gain(0.9),
  s("~ ~ ~ cp")
    .gain(0.9)
    .delay(0.4)
    .delayfeedback(0.3),
  note("<[c4 e4 g4] [e4 g4 c5] [c4 g4 e5] [g4 c5 e5]>")
    .s("square")
    .lpf(4000)
    .decay(0.08)
    .gain(0.6)
    .delay(0.5)
    .delaytime(0.125)
    .delayfeedback(0.3)
)