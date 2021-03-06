require('dotenv/config')
const { createApp } = require('./create-app')
const { createSocket } = require('./create-socket')
const { MongoClient } = require('mongodb')
const { highlightsGateway } = require('./gateways/highlights-gateway')
const { channelsGateway } = require('./gateways/channels-gateway')
const { usersGateway } = require('./gateways/users-gateway')
const EventEmitter = require('events').EventEmitter
const eventEmitter = new EventEmitter()

MongoClient.connect(process.env.MONGODB_URI, async (err, db) => {

  if (err) console.log(err)

  const highlights = db.collection('highlights')
  const channels = db.collection('channels')
  const users = db.collection('users')

  const app = createApp(
    highlightsGateway(highlights, eventEmitter),
    channelsGateway(channels, eventEmitter),
    usersGateway(users, eventEmitter)
  )

  const server = app.listen(process.env.PORT, () => {
    console.log('Listening on ' + process.env.PORT)
  })

  createSocket(
    server,
    eventEmitter,
    highlightsGateway(highlights, eventEmitter),
    channelsGateway(channels, eventEmitter),
    usersGateway(users, eventEmitter)
  )

})
