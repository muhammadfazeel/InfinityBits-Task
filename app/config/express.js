'use strict'

// Get dependencies
const express = require('express')
const path = require('path')
const config = require('./config')
const expressValidator = require('express-validator')
const cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

module.exports = function (app, passport) {
  // Parsers for POST data
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: false
  }))
  app.use(expressValidator())

  // app.use(fileUpload())

  // enabling cors
  app.use(cors())

  // Initializing passport
  app.use(passport.initialize())

  // Point static path to dist
  app.use(express.static(path.join(__dirname, '../../dist')))
  app.use(express.static(path.join(__dirname, '../../node_modules')))

  const apiVersion = '/api/v1/auth'

  // Globbing routing files
  config.getGlobbedFiles('./app/routes/**/*.js').forEach(function (routePath) {
    require(path.resolve(routePath))(app, apiVersion)
  })
}
