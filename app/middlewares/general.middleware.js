'use strict'
const SERVER_RESPONSE = require('../config/serverResponses')
const formidable = require('formidable')

function standardErrorResponse (res, err, type, statusCode) {
  let code = SERVER_RESPONSE.VALIDATION_ERROR
  statusCode = parseInt(statusCode)
  if (!isNaN(statusCode)) {
    code = statusCode
  }
  return res.status(code)
    .send({
      status: 'Error',
      message: err,
      location: type
    })
}

// a middleware to attach files and field to form data requests
const attachBodyAndFiles = (req, res, next) => {
  let form = new formidable.IncomingForm()

  form.parse(req, function (err, fields, files) {
    if (err) {
      return standardErrorResponse(res, {
        field: 'general',
        error: '2000',
        message: err
      }, 'attachBodyAndFiles.middleware.generalMiddleware')
    }

    req.files = []
    for (const key in files) {
      if (files.hasOwnProperty(key)) {
        const element = files[key]
        req.files.push(element)
      }
    }
    req.body = fields
    next()
  })
}


module.exports = {
  standardErrorResponse,
  attachBodyAndFiles
}
