function playSynthFallback(vehicleId: string) {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const mkOsc = (type: OscillatorType, freq: number, startTime: number, endTime: number, gainVal: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(gainVal, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, endTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      return { osc, gain, freq: osc.frequency };
    };

    const sounds: Record<string, () => void> = {
      car: () => {
        for (let i = 0; i < 3; i++) {
          const { osc, gain, freq } = mkOsc("sawtooth", 80 + i * 15, now, now + 0.7, 0.06);
          freq.linearRampToValueAtTime(120 + i * 15, now + 0.3);
          freq.linearRampToValueAtTime(90 + i * 15, now + 0.6);
          gain.gain.linearRampToValueAtTime(0.1, now + 0.2);
          osc.start(now); osc.stop(now + 0.7);
        }
        const { osc } = mkOsc("square", 440, now + 0.3, now + 0.6, 0.08);
        osc.start(now + 0.3); osc.stop(now + 0.6);
      },
      truck: () => {
        for (let i = 0; i < 4; i++) {
          const { osc, gain } = mkOsc("sawtooth", 50 + i * 10, now, now + 0.8, 0.07);
          gain.gain.setValueAtTime(0.04, now + 0.15);
          gain.gain.setValueAtTime(0.08, now + 0.3);
          osc.start(now); osc.stop(now + 0.8);
        }
        const { osc, gain } = mkOsc("sawtooth", 180, now + 0.4, now + 1.0, 0);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.5);
        osc.start(now + 0.4); osc.stop(now + 1.0);
      },
      train: () => {
        [0, 0.3].forEach((off) => {
          const { osc } = mkOsc("sawtooth", 60, now + off, now + off + 0.2, 0.1);
          osc.start(now + off); osc.stop(now + off + 0.25);
        });
        const { osc, freq } = mkOsc("sine", 700, now + 0.6, now + 1.2, 0.12);
        freq.linearRampToValueAtTime(600, now + 1.2);
        osc.start(now + 0.6); osc.stop(now + 1.3);
      },
      plane: () => {
        for (let i = 0; i < 3; i++) {
          const { osc, gain, freq } = mkOsc(i === 0 ? "sawtooth" : "triangle", 100 + i * 50, now, now + 1.0, 0.04);
          freq.exponentialRampToValueAtTime(400 + i * 100, now + 0.8);
          gain.gain.linearRampToValueAtTime(0.1, now + 0.5);
          osc.start(now); osc.stop(now + 1.0);
        }
      },
      boat: () => {
        const { osc, gain, freq } = mkOsc("sawtooth", 120, now, now + 0.9, 0.12);
        freq.linearRampToValueAtTime(115, now + 0.8);
        gain.gain.setValueAtTime(0.12, now + 0.5);
        osc.start(now); osc.stop(now + 1.0);
        const { osc: o2 } = mkOsc("sine", 85, now, now + 0.9, 0.08);
        o2.start(now); o2.stop(now + 1.0);
      },
      firetruck: () => {
        const { osc, freq } = mkOsc("square", 600, now, now + 1.0, 0.08);
        freq.setValueAtTime(800, now + 0.25);
        freq.setValueAtTime(600, now + 0.5);
        freq.setValueAtTime(800, now + 0.75);
        osc.start(now); osc.stop(now + 1.1);
      },
      helicopter: () => {
        for (let i = 0; i < 8; i++) {
          const t = now + i * 0.1;
          const { osc } = mkOsc("sawtooth", 70, t, t + 0.06, 0.1);
          osc.start(t); osc.stop(t + 0.08);
        }
        const { osc, freq } = mkOsc("sine", 400, now, now + 0.9, 0.04);
        freq.linearRampToValueAtTime(600, now + 0.8);
        osc.start(now); osc.stop(now + 0.9);
      },
      motorcycle: () => {
        for (let i = 0; i < 3; i++) {
          const { osc, gain, freq } = mkOsc("sawtooth", 100 + i * 20, now, now + 0.7, 0.06);
          freq.exponentialRampToValueAtTime(300 + i * 30, now + 0.3);
          freq.exponentialRampToValueAtTime(150 + i * 20, now + 0.6);
          gain.gain.linearRampToValueAtTime(0.1, now + 0.2);
          osc.start(now); osc.stop(now + 0.7);
        }
      },
      bicycle: () => {
        [0, 0.2].forEach((off) => {
          const { osc } = mkOsc("sine", 1200, now + off, now + off + 0.3, 0.12);
          osc.start(now + off); osc.stop(now + off + 0.35);
          const { osc: o2 } = mkOsc("sine", 2400, now + off, now + off + 0.2, 0.05);
          o2.start(now + off); o2.stop(now + off + 0.25);
        });
      },
    };

    const play = sounds[vehicleId];
    if (play) play();
  } catch (_e) {
    // Audio not supported
  }
}

export function playVehicleSound(vehicleId: string) {
  try {
    const audio = new Audio(`/sounds/${vehicleId}.mp3`);
    audio.volume = 0.7;
    audio.play().catch(() => {
      playSynthFallback(vehicleId);
    });
  } catch (_e) {
    playSynthFallback(vehicleId);
  }
}
