export default function Header({ providerName }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-bg-primary-glass backdrop-blur-[12px] border-b border-border">
      <div className="max-w-[1200px] mx-auto px-6 py-3.5 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 no-underline font-mono">
          <div className="w-7 h-7 border-2 border-neon rounded-sm flex items-center justify-center text-sm text-neon font-bold shadow-[0_0_8px_var(--color-neon-glow)]">
            ZK
          </div>
          <span className="text-base font-semibold text-text-secondary tracking-wide">
            <span className="text-neon">reclaim</span>::proof
          </span>
        </a>

        <a href="https://cal.com/adithyadinesh/30min" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold font-mono text-neon bg-transparent border border-neon-dark rounded uppercase tracking-wide no-underline hover:bg-neon-glow hover:border-neon hover:shadow-[0_0_16px_var(--color-neon-glow)] transition-all">
          Talk to the Team
        </a>
      </div>
    </header>
  )
}
