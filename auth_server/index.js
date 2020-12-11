const log4js = require('log4js')
const express = require('express')

const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./db.json')

const app = express()
const port = 11221
const host = '192.168.1.3'

// Logger configuration
log4js.configure({
  appenders: {
    toConsole: { type: 'console' }
  },
  categories: {
    default: { appenders: ['toConsole'], level: 'trace' }
  }
})
const logger = log4js.getLogger('default')

// Server configuration
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(function (req, res, next) {
  logger.info([
    'REQUEST',
    `ip:${req.ip}`,
    `url:${req.url}`,
    `path:${req.path}`,
    `hostname:${req.hostname}`,
    `method:${req.method}`,
    `body:${req.body}`
  ].join(' '))
  next()
})

app.post(/^\/login\/?$/, (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  if ('code' in req.body) {
    const code = req.body.code.toString().toUpperCase()

    if (code.length === 6) {
      if (/^[a-zA-Z0-9]{6}$/.test(code)) {
        const objectId = code.substr(0, 3)
        const key = code.substr(3)

        if (objectId in db && db[objectId].keys.includes(key)) {
          res.status(200).end(JSON.stringify({
            message: 'Авторизация успешно пройдена',
            title: db[objectId].title,
            server: db[objectId].server
          }))
        } else {
          res.status(401).end(JSON.stringify({ message: 'Неверный код' }))
        }
      } else {
        res.status(401).end(JSON.stringify({ message: 'Неверный формат кода' }))
      }
    } else {
      res.status(401).end(JSON.stringify({ message: 'Неверная длина кода' }))
    }
  } else {
    res.status(401).end(JSON.stringify({ message: 'Ошибка сервера' }))
  }
})

app.listen(port, host, () => {
  console.log(`Сервер авторизации запущен на http://${host}:${port}`)})
