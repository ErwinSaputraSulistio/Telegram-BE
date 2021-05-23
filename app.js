const express = require('express')
const morgan = require('morgan')
// first set-ups (require)
require('dotenv').config()
const cors = require('cors')
const http = require('http')
const socket = require('socket.io')
const route = require('./files/routes')
const moment = require('moment')
moment.locale('id');
const port = process.env.PORT || 3000
const host = process.env.DB_HOST

const app = express()
const httpServer = http.createServer(app)
const io = socket(httpServer, { cors: { origin: '*', } })

// use
app.use(morgan('dev'))
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/v1', route)
app.use('/img', express.static('./uploads/images'))
httpServer.listen(port, host, () => { console.log('Server telah di-aktivasi dengan port ' + port) })

// socket.io
io.on("connection", (socket) => {
  socket.on("initialRoom", ({ namaRoom }) => { socket.join(`room:${namaRoom}`) })
  socket.on('sendMessage', (data) => {
    // messageModels.insetMessage(data)
    const date = new Date()
    const timeNow = moment(date).format('LT')
    const dataMessage = { ...data, time: timeNow }
    io.to(`room:${data.room}`).emit('receiverMessage', dataMessage)
  })
})