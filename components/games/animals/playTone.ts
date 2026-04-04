const synthTones: Record<string, number[]> = {
  cow: [180, 160, 140],
  dog: [400, 500, 400],
  cat: [600, 650, 500],
  duck: [350, 400, 350],
  pig: [300, 350, 300],
  lion: [120, 100, 80],
  frog: [250, 400, 250],
  bird: [800, 1000, 900, 1100, 800],
  horse: [500, 600, 700, 400],
};

function playSynthTone(animalId: string) {
  const ctx = new AudioContext();
  const freqs = synthTones[animalId] || [440];
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = animalId === "bird" ? "sine" : "sawtooth";
    osc.frequency.value = freq;
    gain.gain.value = 0.15;
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + 0.15 * (i + 1) + 0.2,
    );
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + 0.15 * i);
    osc.stop(ctx.currentTime + 0.15 * (i + 1) + 0.2);
  });
}

export function playTone(animalId: string) {
  try {
    const audio = new Audio(`/sounds/${animalId}.mp3`);
    audio.volume = 0.7;
    audio.play().catch(() => {
      playSynthTone(animalId);
    });
  } catch {
    playSynthTone(animalId);
  }
}
