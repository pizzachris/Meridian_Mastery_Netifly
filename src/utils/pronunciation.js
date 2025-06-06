/**
 * Pronunciation utility for Korean text-to-speech
 */

class PronunciationManager {
  constructor() {
    this.voices = []
    this.koreanVoice = null
    this.fallbackVoice = null
    this.isInitialized = false
  }

  async loadVoices() {
    try {
      // Wait for voices to be loaded
      if (typeof speechSynthesis === 'undefined') {
        console.warn('Speech synthesis not supported in this browser')
        return
      }

      // If voices are already loaded
      if (speechSynthesis.getVoices().length > 0) {
        this.voices = speechSynthesis.getVoices()
        this.initializeVoices()
        return
      }

      // Wait for voices to be loaded
      await new Promise((resolve) => {
        speechSynthesis.onvoiceschanged = () => {
          this.voices = speechSynthesis.getVoices()
          this.initializeVoices()
          resolve()
        }
      })
    } catch (error) {
      console.error('Error loading voices:', error)
      // Continue without voice support
    }
  }

  initializeVoices() {
    if (this.voices.length === 0) {
      console.warn('No voices available')
      return
    }

    // Try to find Korean voice
    this.koreanVoice = this.voices.find(voice => 
      voice.lang.includes('ko') || voice.name.includes('Korean')
    )

    // If no Korean voice, use any available voice
    this.fallbackVoice = this.voices[0]

    console.log('Available voices:', this.voices.length)
    console.log('Korean voices found:', this.koreanVoice ? 1 : 0)
    console.log('Selected Korean voice:', this.koreanVoice?.name, this.koreanVoice?.lang)
    console.log('Fallback voice:', this.fallbackVoice?.name)
    console.log('Available languages:', this.voices.map(v => v.lang))
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
