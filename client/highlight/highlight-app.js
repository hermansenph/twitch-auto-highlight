import React from 'react'
import HighlightDivs from './highlight-divs'
import highlightFetch from './highlight-fetch'
import { socket } from '../socket.js'

export default class HighlightApp extends React.Component {

  constructor() {
    super()
    this.state = {
      highlightArray: [],
      channel: ''
    }

    this.updateHighlightArray = this.updateHighlightArray.bind(this)
    this.handleNewHash = this.handleNewHash.bind(this)
  }

  async componentDidMount() {
    this.updateHighlightArray()
    window.addEventListener('hashchange', this.handleNewHash)
  }

  async handleNewHash() {
    await this.setState({channel: window.location.hash.slice(1)})
    socket.emit('highlightListChange', this.state.channel)
  }

  async updateHighlightArray() {
    const highlightArray = await highlightFetch(this.state.channel)
    if (highlightArray) await this.setState({highlightArray: highlightArray})
  }

  render() {
    return (
      <HighlightDivs highlights={ this.state.highlightArray }/>
    )
  }
}
