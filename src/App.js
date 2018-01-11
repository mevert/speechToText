import React, { Component } from 'react'
import { MuiThemeProvider, createMuiTheme, withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import copy from 'copy-to-clipboard'
import { ToastContainer, toast } from 'react-toastify'

import './styles.css'
import SpeechRecognitionApi from './helpers/SpeechRecognitionApi'

const theme = createMuiTheme()

const LANGUAGES = [
  'en-US',
  'fi-FI',
  'es',
  'de',
]

// Setup Web Speech API
const recognition = new SpeechRecognitionApi('en-US')

const styles = theme => ({
  container: {
    maxWidth: 450,
    textAlign: 'center',
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  content: {
    padding: theme.spacing.unit
  },
  incompatible: {
    color: 'red'
  },
  list: {
    width: '100%',
    overflow: 'auto',
    maxHeight: 50,
    margin: theme.spacing.unit,
  },
  listItem: {
    padding: '2px 16px 2px 16px'
  },
  button: {
    margin: theme.spacing.unit
  }
})

class App extends Component {
  state = {
    finalTranscript: '',
    interimTranscript: '',
    isRecording: false,
    lang: 'en-US'
  }

  componentWillMount () {
    try {
      recognition.onResult(this.updateTranscript)
    } catch (error) {
      console.log(error)
    }
  }

  handleClearButtonClick = () => {
    this.setState({
      finalTranscript: '',
      interimTranscript: ''
    })
  }

  handleCopyButtonClick = () => {
    copy(this.state.finalTranscript)
    toast('Text copied to your clipboard!')
  }

  handleStartButtonClick = () => {
    if (this.state.isRecording) {
      try {
        recognition.stop()
        this.setState({ isRecording: false })
      } catch (error) {
       toast(`Could not stop recording. ${error.message}`)
      }
    } else {
      try {
        recognition.start()
        this.setState({ isRecording: true })
      } catch (error) {
       this.setState({ isRecording: false })
       toast(`Could not start recording. ${error.message}`)
      }
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

  setLanguage = (lang) => {
    recognition.changeLanguage(lang)
    this.setState({
      lang: lang
    })
  }

  renderOptions = classes => {
    const pulse = `rec ${this.state.isRecording && 'pulse'}`
    return (
      <div className={classes.content}>
        <Typography type='subheading'>
          Current language: {this.state.lang}
        </Typography>
        <List className={classes.list} >
          {LANGUAGES.map((lang, i) => {
            return (
              <ListItem className={classes.listItem} onClick={() => this.setLanguage(lang)} button key={`list-${i}`}>
                <ListItemText primary={lang} />
              </ListItem>
            )
          })}
      </List>
      <Button className={classes.button} color='primary' onClick={this.handleStartButtonClick} >
      <span className={pulse}></span> { this.state.isRecording ? 'Stop recording' : 'Start recording' }
      </Button>
      <Button className={classes.button} color='primary' onClick={this.handleCopyButtonClick} >
        Copy
      </Button>
      <Button className={classes.button} color='primary' onClick={this.handleClearButtonClick} >
        Clear
      </Button>
    </div>
    )
  }

  render () {
    const { classes } = this.props
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.container}>
          <div className={classes.content}>
            <Typography key='title' type='display1' gutterBottom>
              Speech to text
            </Typography>
            <Typography component='p'>
              Simple React application that uses the Web Speech API in order to convert speech to text.
              Application should work with Chrome v. >= 63 browsers. See codes from <a target='_blank' rel='noopener noreferrer' href='https://github.com/mevert/speechToText'>GitHub</a>
            </Typography>
          </div>
          <Divider light />
          { recognition.isSupported() ?  
            this.renderOptions(classes) : 
            <p className={classes.incompatible}>Your browser is incompatible with Web Speech API. Try Chrome.</p>
          }
          <p>{this.state.finalTranscript}</p>
        </div>
        <ToastContainer />
      </MuiThemeProvider>
    )
  }
}

export default withStyles(styles)(App)
