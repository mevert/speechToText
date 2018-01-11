
class SpeechRecognitionApi {
  constructor (lang) {
    const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition ||
    window.oSpeechRecognition

    this.recognition = SpeechRecognition
      ? new SpeechRecognition()
      : null
   
    // initialise speech recognition
    if (this.recognition) {
      this.recognition.lang = lang  
      this.recognition.interimResults = true
      this.recognition.maxAlternatives = 5
      this.recognition.continuous = true    
    }
  }

  isSupported () {
    return !!this.recognition
  }

  start () {
    this.recognition.start()
  }

  stop () {
    this.recognition.stop()
  }

  onResult (e) {
    this.recognition.onresult = e
  }

  changeLanguage (lang) {
    this.recognition.lang = lang
  }
}

export default SpeechRecognitionApi
