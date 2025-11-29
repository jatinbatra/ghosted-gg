'use client'

interface DeathCertificateProps {
  result: any
}

export default function DeathCertificate({ result }: DeathCertificateProps) {
  const downloadCertificate = () => {
    const certificate = `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║              ☠️  OFFICIAL DEATH CERTIFICATE  ☠️            ║
║                                                           ║
║                      GHOSTED.GG                           ║
║              Digital Morgue & Autopsy Division            ║
║                                                           ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  CASE NUMBER: ${Date.now()}                               
║  DATE OF DEATH: ${new Date().toLocaleDateString()}        
║  TIME OF DEATH: ${new Date().toLocaleTimeString()}        
║                                                           ║
║  GHOSTING PROBABILITY: ${result.ghosting_probability}%    
║  SEVERITY: ${result.severity_meter}                       
║                                                           ║
║  CAUSE OF DEATH:                                          ║
║  ${result.cause_of_death}                                 
║                                                           ║
║  MANNER OF DEATH: ${result.ghosting_type}                 
║                                                           ║
║  FINAL VERDICT:                                           ║
║  ${result.verdict}                                        
║                                                           ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  This conversation has been officially declared DEAD      ║
║  and is hereby committed to the digital graveyard.        ║
║                                                           ║
║  Signed: Dr. Ghost, Chief Medical Examiner                ║
║          Ghosted.gg Forensics Department                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

May your next conversation live longer. 🕊️
`

    const blob = new Blob([certificate], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `death-certificate-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="ghost-card p-8 border-4 border-red-500">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">📜</div>
        <h3 className="text-2xl font-bold text-red-500 mb-2">
          OFFICIAL DEATH CERTIFICATE
        </h3>
        <p className="text-gray-400">
          Legal documentation of your conversation's demise
        </p>
      </div>

      <div className="bg-black bg-opacity-50 p-6 border-2 border-red-900 font-mono text-xs text-gray-300 mb-6 overflow-x-auto">
        <pre className="whitespace-pre-wrap">
{`╔═══════════════════════════════════════════╗
║     ☠️  OFFICIAL DEATH CERTIFICATE  ☠️     ║
║              GHOSTED.GG                   ║
╠═══════════════════════════════════════════╣
  
  DATE: ${new Date().toLocaleDateString()}
  GHOSTING PROBABILITY: ${result.ghosting_probability}%
  SEVERITY: ${result.severity_meter}
  
  CAUSE OF DEATH:
  ${result.cause_of_death}
  
  Signed: Dr. Ghost, Chief Medical Examiner
  
╚═══════════════════════════════════════════╝`}
        </pre>
      </div>

      <div className="text-center">
        <button
          onClick={downloadCertificate}
          className="spooky-button px-8 py-4 text-lg font-bold text-red-400"
        >
          📥 Download Certificate
        </button>
      </div>
    </div>
  )
}
