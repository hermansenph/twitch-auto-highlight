import React from 'react'
import channelFetch from '../channel/channel-fetch'
import SidebarDivs from './sidebar-divs'
import { socket } from '../socket.js'

export default class SidebarApp extends React.Component {

  constructor() {
    super()
    this.state = {channelArrayData: []}

    this.updateChannelArray = this.updateChannelArray.bind(this)
  }

  async componentDidMount() {
    socket.emit('channelArrayUpdate', document.cookie.slice(6))
    socket.on('channelArrayNew', (userObject) => {
      this.updateChannelArray(userObject.channelArray)
    })
  }

  async updateChannelArray(channelArray) {
    const channelArrayData = await channelFetch({channelId: channelArray})
    this.setState({channelArrayData: channelArrayData})
  }

  render() {
    return (
      <div id="sidebar-div" className={this.props.className}>
        <SidebarDivs channelArrayData={this.state.channelArrayData}/>
      </div>
    )
  }
}
