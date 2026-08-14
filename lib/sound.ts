let audioCtx: AudioContext | null = null;
let enabled = true;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    audioCtx = new AudioContextCtor();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundEnabled(value: boolean) {
  enabled = value;
}

export function isSoundEnabled() {
  return enabled;
}

function tone(
  ctx: AudioContext,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType = "sine",
  gainPeak = 0.25,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  gain.gain.setValueAtTime(0, ctx.currentTime + start);
  gain.gain.linearRampToValueAtTime(gainPeak, ctx.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + start + duration,
  );
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration + 0.05);
}

export function playReveal() {
  if (!enabled) return;
  const ctx = getCtx();
  if (!ctx) return;
  tone(ctx, 660, 0, 0.12, "triangle", 0.22);
  tone(ctx, 990, 0.09, 0.18, "triangle", 0.22);
}

export function playStrike() {
  if (!enabled) return;
  const ctx = getCtx();
  if (!ctx) return;
  tone(ctx, 180, 0, 0.35, "sawtooth", 0.3);
  tone(ctx, 120, 0.05, 0.45, "square", 0.25);
}

export function playBuzzIn() {
  if (!enabled) return;
  const ctx = getCtx();
  if (!ctx) return;
  tone(ctx, 520, 0, 0.15, "square", 0.2);
}

export function playFanfare() {
  if (!enabled) return;
  const ctx = getCtx();
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    tone(ctx, freq, i * 0.12, 0.3, "triangle", 0.25);
  });
}
