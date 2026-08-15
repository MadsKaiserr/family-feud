export default function Logo({ small = false }: { small?: boolean }) {
  return (
    <div
      className={`font-display select-none text-center leading-none ${
        small ? "text-4xl md:text-5xl" : "text-6xl md:text-8xl"
      }`}
    >
      <span
        className="inline-block text-[var(--feud-gold)]"
        style={{
          WebkitTextStroke: "3px #7a1a00",
          textShadow:
            "0 3px 0 #b3401f, 0 6px 0 #7a1a00, 0 10px 18px rgba(0,0,0,0.55)",
        }}
      >
        FAMILIEN BONDE & KAISER
      </span>{" "}
      <span
        className="inline-block text-[var(--feud-red)]"
        style={{
          WebkitTextStroke: "3px #3a0a0a",
          textShadow:
            "0 3px 0 #ffcf5c, 0 6px 0 #7a1a00, 0 10px 18px rgba(0,0,0,0.55)",
        }}
      >
        FEUD
      </span>
    </div>
  );
}
