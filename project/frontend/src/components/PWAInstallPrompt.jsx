import { useState, useEffect } from 'react'
import { Download, X, Smartphone, Crown } from 'lucide-react'
import toast from 'react-hot-toast'

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if device is iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Check if app is already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
    setIsStandalone(standalone)

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Show prompt after a delay if not already installed
      if (!standalone) {
        setTimeout(() => {
          setShowPrompt(true)
        }, 3000) // Show after 3 seconds
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // For iOS devices, show custom prompt
    if (iOS && !standalone) {
      setTimeout(() => {
        setShowPrompt(true)
      }, 3000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        // Show the install prompt
        deferredPrompt.prompt()
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice
        
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt')
          toast.success('App is being installed!')
          setDeferredPrompt(null)
          setShowPrompt(false)
        } else {
          console.log('User dismissed the install prompt')
          toast.info('You can install the app anytime from your browser menu')
        }
      } catch (error) {
        console.error('Error during installation:', error)
        toast.error('Installation failed. Please try again.')
      }
    } else if (isIOS) {
      // For iOS, show instructions
      toast.info('To install: Tap Share button → Add to Home Screen', {
        duration: 5000
      })
    } else {
      // Fallback for other browsers
      toast.info('To install: Look for "Install" option in your browser menu', {
        duration: 4000
      })
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  // Don't show if already dismissed in this session or if already installed
  if (sessionStorage.getItem('pwa-prompt-dismissed') || isStandalone || !showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-fadeIn">
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl shadow-2xl p-4 border border-pink-300">
        <div className="flex items-start space-x-3">
          <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
            <Crown className="h-6 w-6" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Install Yasoda Nandani</h3>
            <p className="text-pink-100 text-sm mb-3">
              Get the full app experience! Install our app for faster access and offline browsing.
            </p>
            
            <div className="flex items-center space-x-2">
              {isIOS ? (
                <div className="text-xs text-pink-100">
                  Tap <span className="font-bold">Share</span> → <span className="font-bold">Add to Home Screen</span>
                </div>
              ) : (
                <button
                  onClick={handleInstallClick}
                  className="bg-white text-pink-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-pink-50 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Install App</span>
                </button>
              )}
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="text-pink-200 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mt-3 flex items-center space-x-4 text-xs text-pink-100">
          <div className="flex items-center space-x-1">
            <Smartphone className="h-3 w-3" />
            <span>Works offline</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="h-3 w-3" />
            <span>Fast loading</span>
          </div>
          <div className="flex items-center space-x-1">
            <Crown className="h-3 w-3" />
            <span>Native feel</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PWAInstallPrompt