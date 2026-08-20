// Deterministic avatar: an emoji on a gradient, derived purely from a seed
// string (no external images, CSP-safe).

const EMOJIS = ['🚢', '⚓', '🧭', '📦', '🌍', '🛰️', '🛳️', '🚀', '🏭', '🗺️', '⛴️', '🧊', '🛢️', '🚚', '✈️', '🛩️'];
const GRADIENTS = [
  ['#388bfd', '#1f6feb'],
  ['#2ea043', '#238636'],
  ['#d29922', '#bb8009'],
  ['#a371f7', '#8957e5'],
  ['#db61a2', '#bf4b8a'],
  ['#f85149', '#da3633'],
  ['#39c5cf', '#1b9aaa'],
  ['#ff7b72', '#f0883e'],
];

function hashSeed(seed) {
  let h = 2166136261;
  const s = String(seed || 'default');
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export default function Avatar({ seed, size = 40, title }) {
  const h = hashSeed(seed);
  const emoji = EMOJIS[h % EMOJIS.length];
  const [c1, c2] = GRADIENTS[(h >> 3) % GRADIENTS.length];

  return (
    <div
      title={title}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.5,
        lineHeight: 1,
        flexShrink: 0,
        userSelect: 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,.4)',
      }}
    >
      <span>{emoji}</span>
    </div>
  );
}
