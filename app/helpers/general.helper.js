'use strict'

var PromiseReturns = require('bluebird')
var StandardError = require('standard-error')
var _ = require('lodash')
var fs = require('fs')

function rejectPromise (message, code = null) {
  return new PromiseReturns(function (resolve, reject) {
    reject(new StandardError({
      status: 'Error',
      message: message,
      statusCode: code
    }))
  })
}

function catchException (err) {
  return rejectPromise(err.message, err.statusCode)
}

module.exports = {
  rejectPromise,
  catchException
}
