
export const getSpeechRecognition = (lang) => {
  try {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)()
    recognition.lang = lang
    recognition.interimResults = true
    recognition.maxAlternatives = 5
    recognition.continuous = true
    return recognition
  } catch (error) {
   console.log(error) 
   return false
  }
}
