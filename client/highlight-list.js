import React from 'react'

export default function HighlightList({ highlights }) {
  return (

    <div id="highlights">
      {highlights.map(renderDiv)}
    </div>

  )
}

function renderDiv(streamArray, iterator) {

  function renderHighlight(highlight) {
    return <div id={highlight._id} key={highlight._id}></div>
  }

  return <div id={streamArray[0].vod} key={iterator}>
    <h3>{streamArray[0].channel + ' - ' + streamArray[0].date}</h3>
    {streamArray.map(renderHighlight)}
  </div>
}