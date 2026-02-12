import { useState } from 'react'

export default function RawProofJson({ proofData }) {
  const [open, setOpen] = useState(false)

  if (!proofData) return null

  return (
    <div className="mt-3.5 pt-3.5 border-t border-border">
      <button
        className="text-[11px] font-medium font-mono text-cyan bg-transparent border-none cursor-pointer p-0 underline underline-offset-[3px] hover:opacity-80"
        onClick={() => setOpen(v => !v)}
      >
        {open ? '$ hide proof.json' : '$ cat proof.json'}
      </button>

      {open && (
        <pre className="mt-2.5 text-[10px] font-mono text-text-secondary bg-bg-primary border border-border rounded p-3 max-h-[200px] overflow-y-auto whitespace-pre-wrap break-all">
          {JSON.stringify(proofData, null, 2)}
        </pre>
      )}
    </div>
  )
}
