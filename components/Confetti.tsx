"use client";

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
}

// Deterministic pseudo-random spread (no Math.random) so the burst stays a
// pure function of its id — safe to compute directly during render.
function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function makePieces(burstId: number, count = 40): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: seeded(i, burstId + 1) * 100,
    delay: seeded(i, burstId + 2) * 0.35,
    duration: 1.5 + seeded(i, burstId + 3) * 1.1,
    color: ["#ffcf5c", "#d61f2c", "#1e40c4", "#ffffff", "#3ddc84"][i % 5],
    size: 6 + seeded(i, burstId + 4) * 8,
  }));
}

export default function ConfettiBurst({ burstId }: { burstId: number }) {
  const pieces = makePieces(burstId);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((c) => (
        <span
          key={c.id}
          className="animate-confetti absolute top-0 rounded-sm"
          style={{
            left: `${c.left}%`,
            width: c.size,
            height: c.size * 0.4,
            backgroundColor: c.color,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
