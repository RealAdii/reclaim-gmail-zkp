import { useState, useCallback, useEffect } from 'react'
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk'
import { APP_ID, APP_SECRET, PROVIDER_ID, PROVIDER_NAME } from './config'
import Header from './components/Header'
import VerifyButton from './components/VerifyButton'
import VerificationIframe from './components/VerificationIframe'
import ProofResult from './components/ProofResult'
import RawProofJson from './components/RawProofJson'

function parseProofData(proofs) {
  if (!proofs || proofs.length === 0) return {}

  const proof = proofs[0]

  if (proof.extractedParameterValues) {
    return typeof proof.extractedParameterValues === 'string'
      ? JSON.parse(proof.extractedParameterValues)
      : proof.extractedParameterValues
  }

  if (proof.claimData?.context) {
    const context = typeof proof.claimData.context === 'string'
      ? JSON.parse(proof.claimData.context)
      : proof.claimData.context
    return context.extractedParameters || context
  }

  if (proof.claimData?.parameters) {
    return typeof proof.claimData.parameters === 'string'
      ? JSON.parse(proof.claimData.parameters)
      : proof.claimData.parameters
  }

  if (proof.publicData) {
    return typeof proof.publicData === 'string'
      ? JSON.parse(proof.publicData)
      : proof.publicData
  }

  return {}
}

export default function App() {
  const [status, setStatus] = useState('idle') // idle | loading | verifying | success | error
  const [iframeUrl, setIframeUrl] = useState(null)
  const [proofData, setProofData] = useState(null)
  const [extractedData, setExtractedData] = useState(null)
  const [error, setError] = useState(null)

  const handleVerify = useCallback(async () => {
    try {
      setStatus('loading')
      setError(null)
      setProofData(null)
      setExtractedData(null)

      const reclaimRequest = await ReclaimProofRequest.init(
        APP_ID,
        APP_SECRET,
        PROVIDER_ID,
        {
          useAppClip: false,
          customSharePageUrl: 'https://portal.reclaimprotocol.org/popcorn'
        }
      )

      await reclaimRequest.startSession({
        onSuccess: (proofs) => {
          console.log('Proofs received:', proofs)
          setIframeUrl(null)
          setProofData(proofs)
          try {
            setExtractedData(parseProofData(proofs))
          } catch (e) {
            console.error('Error parsing proof:', e)
            setExtractedData({})
          }
          setStatus('success')
        },
        onError: (err) => {
          console.error('Verification error:', err)
          setIframeUrl(null)
          setError(err?.message || String(err))
          setStatus('error')
        }
      })

      const requestUrl = await reclaimRequest.getRequestUrl()
      console.log('Request URL:', requestUrl)
      setIframeUrl(requestUrl)
      setStatus('verifying')
    } catch (err) {
      console.error('Init error:', err)
      setIframeUrl(null)
      setError(err?.message || JSON.stringify(err))
      setStatus('error')
    }
  }, [])

  const handleCloseIframe = useCallback(() => {
    setIframeUrl(null)
    if (status === 'verifying') setStatus('idle')
  }, [status])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleCloseIframe()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [handleCloseIframe])

  return (
    <div className="min-h-screen flex flex-col">
      <Header providerName={PROVIDER_NAME} />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pt-[90px] pb-5 relative overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        {/* Glow orb */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--color-neon-glow-subtle) 0%, transparent 70%)' }} />

        <div className="max-w-[700px] text-center relative z-10">
          {/* Hero tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-neon-glow border border-border-glow rounded font-mono text-[11px] font-semibold text-neon uppercase tracking-[2px] mb-5">
            <div className="w-1.5 h-1.5 bg-neon rounded-full shadow-[0_0_6px_var(--color-neon)] animate-pulse-dot" />
            hi, thanks for trying Reclaim
          </div>

          <h1 className="text-[clamp(28px,4vw,44px)] font-bold leading-[1.15] tracking-tight mb-7 text-text-primary">
            Connect and <span className="text-neon" style={{ textShadow: '0 0 30px var(--color-neon-glow-text)' }}>Verify User Data</span> from any source
          </h1>

          {/* Card */}
          <div className="relative bg-bg-card border border-border rounded p-7 max-w-[480px] mx-auto">
            <span className="absolute -top-[22px] left-0 font-mono text-[11px] text-text-muted hidden sm:block">
              {'// initiate zk-proof generation'}
            </span>

            <VerifyButton
              onClick={handleVerify}
              loading={status === 'loading'}
              providerName={PROVIDER_NAME}
            />

            {/* Status messages */}
            {status === 'loading' && (
              <div className="text-center px-3.5 py-2.5 mt-3.5 rounded text-xs font-medium font-mono bg-neon-glow text-neon border border-border-glow">
                initializing reclaim sdk...
              </div>
            )}
            {status === 'success' && (
              <div className="text-center px-3.5 py-2.5 mt-3.5 rounded text-xs font-medium font-mono bg-neon-glow-bg text-neon border border-neon-dark">
                zk-proof generated successfully
              </div>
            )}
            {status === 'error' && (
              <div className="text-center px-3.5 py-2.5 mt-3.5 rounded text-xs font-medium font-mono bg-error-bg text-error border border-error-border">
                error: {error}
              </div>
            )}

            {/* Proof results */}
            {status === 'success' && extractedData && (
              <div className="animate-fade-in">
                <ProofResult extractedData={extractedData} providerName={PROVIDER_NAME} />
                <RawProofJson proofData={proofData} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Iframe overlay */}
      {iframeUrl && (
        <VerificationIframe
          url={iframeUrl}
          providerName={PROVIDER_NAME}
          onClose={handleCloseIframe}
        />
      )}

      {/* Footer */}
      <footer className="text-center py-4 px-6 text-[11px] font-mono text-text-muted border-t border-border">
        powered by{' '}
        <a href="https://reclaimprotocol.org" target="_blank" rel="noopener noreferrer"
          className="text-neon-dim no-underline hover:text-neon">
          reclaim protocol
        </a>
        {' '}&middot; zero-knowledge proofs
      </footer>
    </div>
  )
}
