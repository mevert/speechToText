import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'

import { getSpeechRecognition } from './config/webSpeechAPI'

// Setup Web Speech API
const recognition = getSpeechRecognition('en-US')

class App extends Component {
  state = {
    finalTranscript: '',
    interimTranscript: '',
    isRecording: false
  }

  handleStartButtonClick = () => {
    if (this.state.isRecording) {
      recognition.stop()
      this.setState({ isRecording: false })
    } else {
      recognition.onresult = this.updateTranscript
      recognition.start()
      this.setState({ isRecording: true })
    }
  }

  concatTranscripts = (...transcriptParts) => {
    return transcriptParts.map(t => t.trim()).join(' ').trim()
  }

  updateTranscript = (event) => {
    let finalTranscript = this.state.finalTranscript
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript = this.concatTranscripts(
          this.state.finalTranscript,
          event.results[i][0].transcript
        )
      }
    }
    this.setState({
      finalTranscript
    })
  }

  render () {
    return (
      <MuiThemeProvider>
        <RaisedButton
          label={this.state.isRecording ? 'Stop recording' : 'Start recording'}
          onClick={this.handleStartButtonClick}
          primary
        />
        <p>{this.state.finalTranscript}</p>
      </MuiThemeProvider>
    )
  }
}

export default App
