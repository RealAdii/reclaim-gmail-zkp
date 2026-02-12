export default function VerifyButton({ onClick, loading, providerName }) {
  return (
    <button
      className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm font-semibold font-mono text-bg-primary bg-neon border-none rounded cursor-pointer glow-neon uppercase tracking-wide hover:bg-neon-hover hover:shadow-[0_0_30px_var(--color-neon-glow-strong),0_0_80px_var(--color-neon-glow)] hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 transition-all"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <>
          <div className="w-[18px] h-[18px] border-[2.5px] border-bg-primary-30 border-t-bg-primary rounded-full animate-spin-fast" />
          Generating...
        </>
      ) : (
        <>
          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Verify
        </>
      )}
    </button>
  )
}
