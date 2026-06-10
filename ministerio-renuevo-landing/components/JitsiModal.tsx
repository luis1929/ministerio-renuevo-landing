'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

declare global {
  interface Window { JitsiMeetExternalAPI: any }
}

export default function JitsiModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const jitsiContainer = useRef<HTMLDivElement>(null)
  const apiRef = useRef<any>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Cargar SDK de Jitsi una sola vez
  useEffect(() => {
    if (typeof window !== 'undefined' && window.JitsiMeetExternalAPI) {
      setScriptLoaded(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://meet.jit.si/external_api.js'
    script.async = true
    script.onload = () => setScriptLoaded(true)
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  // Montar/Desmontar reunión
  useEffect(() => {
    if (!isOpen || !jitsiContainer.current || !scriptLoaded) return

    const domain = 'meet.jit.si'
    const options = {
      roomName: 'MinisterioElRenuevo',
      width: '100%',
      height: '100%',
      parentNode: jitsiContainer.current,
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: true,
        enableLobby: true,
        prejoinPageEnabled: true,
        disableThirdPartyRequests: true,
        toolbarButtons: ['microphone', 'camera', 'desktop', 'chat', 'raisehand', 'participants', 'fullscreen', 'hangup']
      },
      interfaceConfigOverwrite: {
        APP_NAME: 'Ministerio El Renuevo',
        SHOW_JITSI_WATERMARK: false,
        DEFAULT_BACKGROUND: '#0f172a'
      }
    }

    apiRef.current = new window.JitsiMeetExternalAPI(domain, options)

    // Eventos útiles
    apiRef.current.addEventListener('videoConferenceLeft', () => onClose())
    apiRef.current.addEventListener('participantJoined', (p: any) => {
      console.log('Nuevo participante:', p.displayName)
    })

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose()
        apiRef.current = null
      }
    }
  }, [isOpen, scriptLoaded, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-6xl h-[85vh] bg-[hsl(220,35%,6%)] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-[hsl(220,35%,10%)] flex items-center justify-between px-4 z-10">
          <span className="text-gold font-semibold text-sm">🎥 Reunión en Vivo - Ministerio El Renuevo</span>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Jitsi Container */}
        <div ref={jitsiContainer} className="w-full h-full pt-12" />
      </div>
    </div>
  )
}