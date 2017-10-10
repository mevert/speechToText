
export const getSpeechRecognition = (lang) => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)()
  recognition.lang = lang
  recognition.interimResults = true
  recognition.maxAlternatives = 5
  recognition.continuous = true
  return recognition
}
