/* eslint-disable no-undef */

const myHeaders = new Headers()
myHeaders.append('Client-ID', 'l8lprk488tfke811xasmull5ckhwbh')
myHeaders.append('Accept', 'application/vnd.twitchtv.v5+json')

const myInit = {
  method: 'GET',
  headers: myHeaders
}

let channelData = ''
let vodData = ''

const fetchChannel = () => {
  fetch(('https://api.twitch.tv/helix/users?login=' + $search.value), myInit)
    .then(response => {
      return response.json()
    })
    .then(response => {
      if (response.data[0] === undefined) {
        channelData = {
          display_name: 'No Results Found',
          profile_image_url: 'images/twitch-error.png'
        }
      }
      else {
        channelData = response.data[0]
      }
    })
    .then(() => {
      if (channelData.display_name !== 'No Results Found') {
        fetch(('https://api.twitch.tv/kraken/streams/' + channelData.id), myInit)
          .then(response => {
            return response.json()
          })
          .then(response => {
            if (response.stream === null) {
              channelIsStreaming = false
            }
            else {
              channelIsStreaming = true
            }
          })
          .then(() => {
            document.body.appendChild(generateChannel(channelData.display_name, channelData.profile_image_url))
            if (channelIsStreaming) {
              const monitorButton = document.querySelector('#monitor')
              monitorButton.addEventListener('click', activateMonitor)
            }
          })
      }
      else {
        document.body.appendChild(generateChannel(channelData.display_name, channelData.profile_image_url))
      }
    })

}

const generateChannel = (displayName, imgUrl) => {
  if (document.querySelector('#channel-div') !== null) {
    document.querySelector('#channel-div').remove()
  }
  const $div = document.createElement('div')
  const $p = document.createElement('p')
  const $img = document.createElement('img')
  $p.id = 'channel-name'
  $p.textContent = displayName
  $img.id = 'channel-img'
  $img.setAttribute('src', imgUrl)
  $div.id = 'channel-div'
  $div.appendChild($img)
  $div.appendChild($p)
  if (channelData.display_name !== 'No Results Found') {
    if (channelIsStreaming) {
      const $button = document.createElement('button')
      $button.setAttribute('type', 'button')
      $button.id = 'monitor'
      $button.textContent = 'MONITOR'
      $div.appendChild($button)
    }
    else {
      const $p2 = document.createElement('p')
      $p2.id = 'offline'
      $p2.textContent = 'Stream Offline'
      $div.appendChild($p2)
    }
  }
  return $div
}

const searchChannel = (event) => {
  if (event.keyCode === 13) {
    fetchChannel()
  }
}

const $search = document.querySelector('#search-box')
$search.addEventListener('keydown', searchChannel)

const activateMonitor = () => {
  fetch('http://localhost:3000',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        channelData
      })
    }
  )
}

let channelIsStreaming = null
let id = 1

const generateEmbed = (vodHighlight) => {
  const embedId = 'clip' + id
  const embedOptions = {
    width: 426,
    height: 240,
    video: vodHighlight.vod
  }
  const $div = document.createElement('div')
  $div.id = embedId
  document.body.appendChild($div)
  const player = new Twitch.Player(embedId, embedOptions)
  id++
  setTimeout(() => {
    player.seek(vodHighlight.time)
  }, 8000)
}

const fetchVod = () => {
  if (channelData.id !== undefined) {
    fetch(('https://api.twitch.tv/kraken/channels/' + channelData.id + '/videos'), myInit)
      .then(response => {
        return response.json()
      })
      .then(response => {
        vodData = response.videos[0]._id
        if (vodData !== '' && vodData !== undefined) {
          fetchHighlights()
        }
      })
  }
}

const fetchHighlights = () => fetch('http://localhost:3000/highlights',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      vodData
    })
  }
)
  .then(response => {
    return response.json()
  })
  .then(response => {
    for (let i = 0, e = 1; i < response.length; i++, e++) {
      if (document.querySelector('#clip' + e) === null) {
        generateEmbed(response[i])
      }
    }
  })

setInterval(fetchVod, 10000)