function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim()
}

export default function ProofResult({ extractedData, providerName }) {
  const entries = extractedData && typeof extractedData === 'object'
    ? Object.entries(extractedData)
    : []

  return (
    <div className="mt-5 p-5 bg-bg-elevated border border-border-glow rounded text-left">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-border">
        <svg className="w-5 h-5 text-neon shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span className="text-[13px] font-semibold font-mono text-neon uppercase tracking-wide">
          Proof Generated
        </span>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-3">
        {entries.length > 0 ? (
          entries.map(([key, value]) => (
            <div key={key} className="flex flex-col gap-1">
              <div className="text-[10px] font-semibold font-mono uppercase tracking-[1.5px] text-text-muted">
                {formatLabel(key)}
              </div>
              <div className="text-[13px] font-medium font-mono text-neon px-3 py-2 bg-bg-primary border border-border rounded break-all">
                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col gap-1">
            <div className="text-[10px] font-semibold font-mono uppercase tracking-[1.5px] text-text-muted">
              Status
            </div>
            <div className="text-[13px] font-medium font-mono text-neon px-3 py-2 bg-bg-primary border border-border rounded">
              proof_verified: true
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
