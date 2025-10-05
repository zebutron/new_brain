// Configure Strudel to use local samples
export function configureSamples() {
  if (window.loadSamples) {
    // Point to local samples directory
    window.loadSamples({
      bd: '/samples/bd',
      sd: '/samples/sd', 
      hh: '/samples/hh',
      cp: '/samples/cp',
    });
  }
}

