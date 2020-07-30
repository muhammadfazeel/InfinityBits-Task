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

function uploadImageToS3 (imageFile) {
  return new PromiseReturns(function (resolve) {
    if (imageFile) {
      var file = imageFile
      var fileName = file.originalname
      var filePath = config.s3.host_name + config.s3.bucket + '/' + config.s3.paths.original + fileName
      var s3Key = config.s3.paths.original + fileName

      AWS.config.update(config.s3.credentials)
      var s3 = new AWS.S3({ params: { Bucket: config.s3.bucket } })
      var params = {
        Key: s3Key,
        Body: fs.createReadStream(file.path),
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: 'application/octet-stream'
      }
      var obj = {
        s3: s3,
        params: params,
        filePath: filePath
      }
      return resolve(obj)
    } else {
      resolve(null)
    }
  })
}

module.exports = {
  rejectPromise,
  catchException,
  uploadImageToS3
}
