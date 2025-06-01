/**
 * Pronunciation utility for Korean text-to-speech
 */

class PronunciationManager {
  constructor() {
    this.isSupported = 'speechSynthesis' in window
    this.voices = []
    this.koreanVoice = null
    this.fallbackVoice = null
    
    if (this.isSupported) {
      this.loadVoices()
      // Voices might load asynchronously
      speechSynthesis.addEventListener('voiceschanged', () => {
        this.loadVoices()
      })
    }
  }
  loadVoices() {
    this.voices = speechSynthesis.getVoices()
    
    // Find Korean voice with priority order
    const koreanVoices = this.voices.filter(voice => 
      voice.lang.startsWith('ko') || 
      voice.lang.includes('Korean') ||
      voice.name.toLowerCase().includes('korean') ||
      voice.name.toLowerCase().includes('한국') ||
      voice.lang.includes('ko-KR') ||
      voice.lang.includes('ko-kr')
    )
    
    // Prioritize native Korean voices
    this.koreanVoice = koreanVoices.find(voice => voice.lang === 'ko-KR') ||
                      koreanVoices.find(voice => voice.lang.startsWith('ko')) ||
                      koreanVoices[0]
    
    // Find English voice as fallback for romanized text
    this.fallbackVoice = this.voices.find(voice => 
      voice.lang.startsWith('en') && voice.default
    ) || this.voices.find(voice => voice.lang.startsWith('en'))
    
    console.log('Available voices:', this.voices.length)
    console.log('Korean voices found:', koreanVoices.length)
    console.log('Selected Korean voice:', this.koreanVoice?.name, this.koreanVoice?.lang)
    console.log('Fallback voice:', this.fallbackVoice?.name)
    
    // If no Korean voice found, log available languages for debugging
    if (!this.koreanVoice) {
      const availableLangs = [...new Set(this.voices.map(v => v.lang))].sort()
      console.log('Available languages:', availableLangs)
    }
  }
  /**
   * Speak Korean text (Hangul)
   */
  speakKorean(text, options = {}) {
    if (!this.isSupported) {
      console.warn('Speech synthesis not supported')
      return false
    }

    try {
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
  speakRomanized(text, options = {}) {
    if (!this.isSupported) {
      console.warn('Speech synthesis not supported')
      return false
    }

    try {
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
    if (this.isSupported) {
      speechSynthesis.cancel()
    }
  }

  /**
   * Check if pronunciation is supported
   */
  isAvailable() {
    return this.isSupported && this.voices.length > 0
  }
  /**
   * Get available voice information
   */
  getVoiceInfo() {
    return {
      isSupported: this.isSupported,
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
  testKoreanVoice() {
    console.log('Testing Korean voice with sample text...')
    const voiceInfo = this.getVoiceInfo()
    console.log('Voice info:', voiceInfo)
    
    // Test with a simple Korean word
    this.speakKorean('안녕하세요')
    
    return voiceInfo
  }

  /**
   * Force reload voices (useful for debugging)
   */
  reloadVoices() {
    this.loadVoices()
    return this.getVoiceInfo()
  }
}

// Create singleton instance
const pronunciationManager = new PronunciationManager()

export default pronunciationManager
