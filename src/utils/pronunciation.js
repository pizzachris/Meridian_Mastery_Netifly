/**
 * Pronunciation utility for Korean text-to-speech
 */

class PronunciationManager {
  constructor() {
    this.voices = []
    this.koreanVoice = null
    this.fallbackVoice = null
    this.isInitialized = false
    this.initializationPromise = null // Cache initialization promise
  }

  async loadVoices() {
    // Return cached initialization if already in progress
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    
    // Create initialization promise
    this.initializationPromise = this._initializeVoices();
    return this.initializationPromise;
  }

  async _initializeVoices() {
    try {
      // Check for speech synthesis support
      if (typeof speechSynthesis === 'undefined') {
        console.warn('Speech synthesis not supported in this browser')
        this.isInitialized = true;
        return
      }

      // If voices are already loaded
      if (speechSynthesis.getVoices().length > 0) {
        this.voices = speechSynthesis.getVoices()
        this.initializeVoices()
        return
      }

      // Wait for voices to be loaded with timeout
      await Promise.race([
        new Promise((resolve) => {
          speechSynthesis.onvoiceschanged = () => {
            this.voices = speechSynthesis.getVoices()
            this.initializeVoices()
            resolve()
          }
        }),
        new Promise((resolve) => {
          // Timeout after 3 seconds
          setTimeout(() => {
            console.warn('Voice loading timed out')
            this.voices = speechSynthesis.getVoices() || []
            this.initializeVoices()
            resolve()
          }, 3000)
        })
      ])
    } catch (error) {
      console.error('Error loading voices:', error)
      this.isInitialized = true;
      // Continue without voice support
    }
  }

  initializeVoices() {
    if (this.voices.length === 0) {
      console.warn('No voices available')
      this.isInitialized = true;
      return
    }

    // Try to find Korean voice (optimized search)
    this.koreanVoice = this.voices.find(voice => 
      voice.lang.includes('ko') || 
      voice.name.toLowerCase().includes('korean') ||
      voice.lang.startsWith('ko-')
    ) || null

    // Find fallback voice (English or first available)
    this.fallbackVoice = this.voices.find(voice => 
      voice.lang.includes('en') || 
      voice.default
    ) || this.voices[0] || null

    this.isInitialized = true;
    
    if (this.koreanVoice) {
      console.log('Korean voice found:', this.koreanVoice.name)
    } else {
      console.warn('No Korean voice found, using fallback:', this.fallbackVoice?.name)
    }
  }

  // Optimized speak method with caching
  speak(text, isKorean = false, options = {}) {
    if (!this.isInitialized || !text) {
      return Promise.resolve(); // Return resolved promise if not ready
    }

    return new Promise((resolve, reject) => {
      try {
        const utterance = new SpeechSynthesisUtterance(text)
        
        // Choose voice
        const voice = isKorean ? (this.koreanVoice || this.fallbackVoice) : this.fallbackVoice
        if (voice) {
          utterance.voice = voice
        }

        // Apply options with defaults
        utterance.rate = options.rate || 0.8
        utterance.pitch = options.pitch || 1.0
        utterance.volume = options.volume || 1.0

        utterance.onend = () => resolve()
        utterance.onerror = (error) => {
          console.error('Speech synthesis error:', error)
          resolve() // Resolve instead of reject to not break the app
        }

        // Cancel any ongoing speech and speak
        speechSynthesis.cancel()
        speechSynthesis.speak(utterance)
      } catch (error) {
        console.error('Failed to speak:', error)
        resolve() // Resolve instead of reject
      }
    })
  }

  /**
   * Speak Korean text (Hangul)
   */
  async speakKorean(text, options = {}) {
    if (!text) {
      console.warn('No text provided for pronunciation')
      return false
    }

    try {
      // Ensure voices are loaded
      await this.loadVoices()
      
      // Stop any current speech first
      speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Use Korean voice if available, otherwise fallback
      if (this.koreanVoice) {
        utterance.voice = this.koreanVoice
        utterance.lang = 'ko-KR'
        utterance.rate = options.rate || 0.8
        utterance.pitch = options.pitch || 1
      } else {
        // Fallback to English voice but still try Korean language
        utterance.voice = this.fallbackVoice
        utterance.lang = 'ko-KR'
        utterance.rate = options.rate || 0.6 // Slower for non-native voice
        utterance.pitch = options.pitch || 1
        console.warn('No Korean voice available, using fallback voice')
      }
      
      utterance.volume = options.volume || 0.8
      
      // Add error handling
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error)
      }
      
      utterance.onend = () => {
        console.log('Korean pronunciation completed')
      }

      speechSynthesis.speak(utterance)
      return true
    } catch (error) {
      console.error('Speech synthesis error:', error)
      return false
    }
  }

  /**
   * Speak romanized Korean text
   */
  async speakRomanized(text, options = {}) {
    if (!text) {
      console.warn('No text provided for pronunciation')
      return false
    }

    try {
      // Ensure voices are loaded
      await this.loadVoices()
      
      // Stop any current speech first
      speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = this.fallbackVoice
      utterance.rate = options.rate || 0.7
      utterance.pitch = options.pitch || 1
      utterance.volume = options.volume || 0.8
      utterance.lang = 'en-US'
      
      // Add error handling
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error)
      }
      
      utterance.onend = () => {
        console.log('Romanized pronunciation completed')
      }

      speechSynthesis.speak(utterance)
      return true
    } catch (error) {
      console.error('Speech synthesis error:', error)
      return false
    }
  }

  /**
   * Stop any current speech
   */
  stop() {
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel()
    }
  }

  /**
   * Check if pronunciation is supported
   */
  async isAvailable() {
    if (typeof speechSynthesis === 'undefined') return false
    await this.loadVoices()
    return this.voices.length > 0
  }

  /**
   * Get available voice information
   */
  async getVoiceInfo() {
    await this.loadVoices()
    return {
      isSupported: typeof speechSynthesis !== 'undefined',
      hasKoreanVoice: !!this.koreanVoice,
      hasFallbackVoice: !!this.fallbackVoice,
      totalVoices: this.voices.length,
      koreanVoiceName: this.koreanVoice?.name,
      koreanVoiceLang: this.koreanVoice?.lang,
      fallbackVoiceName: this.fallbackVoice?.name,
      allKoreanVoices: this.voices.filter(v => 
        v.lang.startsWith('ko') || 
        v.name.toLowerCase().includes('korean')
      ).map(v => ({ name: v.name, lang: v.lang }))
    }
  }

  /**
   * Test Korean pronunciation with a sample word
   */
  async testKoreanVoice() {
    console.log('Testing Korean voice with sample text...')
    const voiceInfo = await this.getVoiceInfo()
    console.log('Voice info:', voiceInfo)
    
    // Test with a simple Korean word
    await this.speakKorean('안녕하세요')
    
    return voiceInfo
  }

  /**
   * Force reload voices (useful for debugging)
   */
  async reloadVoices() {
    this.voices = []
    this.koreanVoice = null
    this.fallbackVoice = null
    await this.loadVoices()
    return this.getVoiceInfo()
  }
}

export default PronunciationManager
