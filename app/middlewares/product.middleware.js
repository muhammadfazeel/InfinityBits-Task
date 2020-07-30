'use strict'
const generalMiddleware = require('./general.middleware')
const _ = require('lodash')

// ***********************
// validate Search Product
// ***********************

const validateSearchProducts = (req, res, done) => {
  const errorArray = []
  const query = req.query
  const validatedConditions = {}
  let limit = 50
  let offset = 0

  // title is an optional string property, if it is given than validate it.
  if (query.hasOwnProperty('title')) {
    // Validating as not empty, valid String and length range.
    if (_.isEmpty(query.title) || !_.isString(query.title)) {
      errorArray.push({
        field: 'title ',
        error: 90130,
        message: 'Please provide only valid \'title \' as string.'
      })
    }
    validatedConditions.title = query.title
  }

  // minPrice is not required, validating it as not empty, valid String and length range.
  if (query.hasOwnProperty('minPrice') && query.minPrice) {
    if (isNaN(query.minPrice)) {
      errorArray.push({
        field: 'minPrice',
        error: 90230,
        message: '\'minPrice\' is required as string.'
      })
    }
    validatedConditions.minPrice = query.minPrice
  }

  // minPrice is not required, validating it as not empty, valid String and length range.
  if (query.hasOwnProperty('maxPrice') && query.maxPrice) {
    if (isNaN(query.maxPrice)) {
      errorArray.push({
        field: 'maxPrice',
        error: 90230,
        message: '\'maxPrice\' is required as string.'
      })
    }
    validatedConditions.maxPrice = query.maxPrice
  }

  // priority is not required, validating it as not empty, valid String and length range.
  if (query.hasOwnProperty('priority') && query.priority) {
    if (isNaN(query.priority)) {
      errorArray.push({
        field: 'priority',
        error: 90230,
        message: '\'priority\' is required as string.'
      })
    }
    validatedConditions.priority = query.priority
  }

  validatedConditions.isActive = query.hasOwnProperty('isActive') ? query.isActive : 'true'

  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(res, errorArray, 'product.middleware.validateSearchProducts')
  }

  if (query.limit && query.limit > 0) {
    limit = query.limit
  }

  if (query.offset && query.offset > 0) {
    offset = query.offset
  }

  req.conditions = validatedConditions
  req.limit = limit
  req.offset = offset
  done()
}

// *****************************
// Update Product Validations
// *****************************

const validateUpdateProduct = (req, res, done) => {
  const errorArray = []
  const body = req.body
  let id = req.params.id
  const validatedData = {}

  // id is required, validating as not empty, valid numeric value with range.
  if (!id || isNaN(id)) {
    errorArray.push({
      field: 'id',
      error: 40040,
      message: '\'id\' is required as numeric in params.'
    })
  }

  // title is an optional string property, if it is given than validate it.
  if (body.hasOwnProperty('title') && !_.isEmpty(body.title)) {
    // Validating as not empty, valid String and length range.
    if (_.isEmpty(body.title) || !_.isString(body.title) || body.title.length < 2 || body.title.length > 100) {
      errorArray.push({
        field: 'title',
        error: 40050,
        message: 'Please provide only valid \'title\' as string, length must be between 2 and 100.'
      })
    }
    validatedData.title = body.title
  }

  // description is an optional string property, if it is given than validate it.
  if (body.hasOwnProperty('description') && !_.isEmpty(body.description)) {
    // Validating as not empty, valid String and length range.
    if (_.isEmpty(body.description) || !_.isString(body.description) || body.description.length < 2 || body.description.length > 200) {
      errorArray.push({
        field: 'description',
        error: 40080,
        message: 'Please provide only valid \'description\' as string, length must be between 2 and 100.'
      })
    }
    validatedData.description = body.description
  }

  if (body.hasOwnProperty('thumbnail') && body.thumbnail && body.thumbnail !== `undefined`) {
    // thumbnailIndex is  required, validating as not empty, valid numeric value.
    if (!body.thumbnail) {
      errorArray.push({
        field: 'thumbnailIndex',
        error: 90171,
        message: '\'thumbnailIndex\' is required as valid Object.'
      })
    }
    validatedData.thumbnailObject = body.thumbnail
  }

  // deletedImage is an optional numeric property, if it is given than validate it.
  if (body.hasOwnProperty('deletedImage') && body.deletedImage && body.deletedImage !== `undefined`) {
    body.deletedImage = JSON.parse(body.deletedImage)
    // Validating as not empty, valid numeric value with range.
    if (!_.isArray(body.deletedImage)) {
      errorArray.push({
        field: 'deletedImage',
        error: 90000,
        message: 'Please provide only valid \'deletedImage\' as numeric.'
      })
    }
    validatedData.deleteImage = body.deletedImage
  }

  // Price
  if (body.hasOwnProperty('price')) {
    // price is Optional, validating as not empty, valid numeric value with range.
    if (!body.price || isNaN(body.price)) {
      errorArray.push({
        field: 'price',
        error: 90171,
        message: '\'price\' is required as numeric.'
      })
    }
    validatedData.price = body.price
  }

  // isActive is an optional string property, if it is given than validate it.
  if (body.hasOwnProperty('isActive')) {
    // Validating as not empty, valid String and length range.
    if (!body.isActive || (body.isActive != 'true' && body.isActive != 'false')) {
      errorArray.push({
        field: 'isActive ',
        error: 40090,
        message: 'Please provide only valid \'isActive \' as boolean.'
      })
    }
    try {
      validatedData.isActive = JSON.parse(body.isActive)
    } catch (error) {
      console.error(error)
    }
  }

  // Send error Array if error(s).
  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(res, errorArray, 'product.middleware.validateUpdateProduct')
  }

  if (_.isEmpty(validatedData)) {
    return generalMiddleware.standardErrorResponse(res, [{
      field: 'general',
      error: 40100,
      message: 'No data provided to update.'
    }], 'product.middleware.validateUpdateProduct')
  }

  req.body = {
    data: validatedData,
    id: id
  }
  return done()
}

// ****************************
// To Delete Product
// ****************************
const validateDeleteProduct = (req, res, done) => {
  const errorArray = []
  const params = req.params

  if (!params.id || isNaN(params.id)) {
    errorArray.push({
      field: 'id',
      error: 40120,
      message: 'Please provide only valid \'id\' as numeric.'
    })
  }

  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(res, errorArray, 'product.middleware.validateDeleteProduct')
  }
  done()
}

// *********************
// To Add New Product
// *********************

const validateAddProducts = (req, res, done) => {
  const body = req.body
  const validatedBody = {}

  // get all the errors in an array
  const errorArray = []

  // Title is an required  Validating as not empty, valid String and length range.
  if (!_.isString(body.title) || body.title.length < 2 || body.title.length > 100) {
    errorArray.push({
      field: 'title',
      error: 90070,
      message: 'Please provide only valid \'title\' as string, length must be between 2 and 100.'
    })
  }

  // price is required, validating as not empty, valid numeric value with range.
  if (!body.price || isNaN(body.price)) {
    errorArray.push({
      field: 'price',
      error: 90170,
      message: '\'price\' is required as numeric.'
    })
  }

  // priority is required, validating as not empty, valid numeric value with range.
  if (!body.priority || isNaN(body.priority)) {
    errorArray.push({
      field: 'priority',
      error: 90170,
      message: '\'priority\' is required as numeric.'
    })
  }

  // description is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.description) || !_.isString(body.description) || body.description.length < 3 || body.description.length > 4000) {
    errorArray.push({
      field: 'description',
      error: 90100,
      message: '\'description\' is required as string, length must be between 3 and 4000.'
    })
  }

  // isActive is an optional string property, if it is given than validate it.
  if (body.hasOwnProperty('isActive')) {
    // Validating as not empty, valid String and length range.
    if (body.isActive !== true && body.isActive !== false && body.isActive != 'true' && body.isActive != 'false') {
      errorArray.push({
        field: 'isActive ',
        error: 90130,
        message: 'Please provide only valid \'isActive \' as boolean.'
      })
    }
    validatedBody.isActive = body.isActive
  }

  if (body.hasOwnProperty('thumbnailIndex') && body.thumbnailIndex && body.thumbnailIndex !== `undefined`) {
    // thumbnailIndex is  required, validating as not empty, valid numeric value.
    if (!body.thumbnailIndex || isNaN(body.thumbnailIndex)) {
      errorArray.push({
        field: 'thumbnailIndex',
        error: 90171,
        message: '\'thumbnailIndex\' is required as numeric.'
      })
    }
    validatedBody.thumbnailIndex = body.thumbnailIndex
  }


  // send array if error(s)
  if (errorArray.length) {
    return generalMiddleware.standardErrorResponse(res, errorArray, 'products.middleware.validateAddProducts')
  }

  validatedBody.title = body.title
  validatedBody.price = body.price
  validatedBody.priority = body.priority
  validatedBody.description = body.description
  validatedBody.isActive = body.hasOwnProperty('isActive') ? body.isActive : false

  req.body.validatedData = validatedBody

  done()
}

// ***********************************
// To Get All Details Against Given Id
// ***********************************

const validateGetProduct = (req, res, done) => {
  const errorArray = []
  const params = req.params
  const validatedConditions = {}

  // Validating id as Required, not empty, valid numeric value with range.
  if (!params.id || isNaN(params.id)) {
    errorArray.push({
      field: 'id',
      error: 90340,
      message: 'Please provide only valid \'id\' as numeric.'
    })
  }

  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(res, errorArray, 'product.middleware.validateGetProduct')
  }
  validatedConditions.id = params.id
  req.conditions = validatedConditions
  done()
}

module.exports = {
  validateSearchProducts,
  validateUpdateProduct,
  validateDeleteProduct,
  validateAddProducts,
  validateGetProduct
}
