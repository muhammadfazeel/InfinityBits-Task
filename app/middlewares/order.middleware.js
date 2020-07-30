'use strict'
const generalMiddleware = require('./general.middleware')
const _ = require('lodash')

// ***********************
// validate Get order
// ***********************

const validateGetOrder = (req, res, done) => {
    const errorArray = []
    const query = req.query
    const validatedConditions = {}
    let limit = 50
    let offset = 0

    // name is an optional string property, if it is given than validate it.
    if (query.hasOwnProperty('name')) {
        // Validating as not empty, valid String and length range.
        if (_.isEmpty(query.name) || !_.isString(query.name)) {
            errorArray.push({
                field: 'name ',
                error: 90130,
                message: 'Please provide only valid \'name \' as string.'
            })
        }
        validatedConditions.name = query.name
    }

    // orderId is not required, validating it as not empty, valid String and length range.
    if (query.hasOwnProperty('orderId') && query.orderId) {
        if (isNaN(query.orderId)) {
            errorArray.push({
                field: 'orderId',
                error: 90230,
                message: '\'orderId\' is required as string.'
            })
        }
        validatedConditions.orderId = query.orderId
    }

    if (!_.isEmpty(errorArray)) {
        return generalMiddleware.standardErrorResponse(res, errorArray, 'order.middleware.validateGetOrder')
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

// *********************
// To Add New order
// *********************

const validateAddOrder = (req, res, done) => {
    const body = req.body
    const validatedBody = {}
    // get all the errors in an array
    const errorArray = []

    // name is an required  Validating as not empty, valid String and length range.
    if (!_.isString(body.name) || body.name.length < 2 || body.name.length > 100) {
        errorArray.push({
            field: 'name',
            error: 90070,
            message: 'Please provide only valid \'name\' as string, length must be between 2 and 100.'
        })
    }

    // email is an required  Validating as not empty, valid String and length range.
    if (!_.isString(body.email) || body.email.length < 4 || body.email.length > 150) {
        errorArray.push({
            field: 'email',
            error: 90070,
            message: 'Please provide only valid \'email\' as string, length must be between 2 and 150.'
        })
    }

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(body.email)) {
        validatedBody.email = body.email
    } else {
        errorArray.push({
            field: 'email',
            error: 90070,
            message: 'Please Provide Valid Email Address'
        })
    }
    // paidPrice is required, validating as not empty, valid numeric value with range.
    if (!body.paidPrice || isNaN(body.paidPrice)) {
        errorArray.push({
            field: 'paidPrice',
            error: 90170,
            message: '\'paidPrice\' is required as numeric.'
        })
    }

    // ProductId is required, validating as not empty, valid numeric value with range.
    if (!body.ProductId || isNaN(body.ProductId)) {
        errorArray.push({
            field: 'ProductId',
            error: 90170,
            message: '\'ProductId\' is required as numeric.'
        })
    }

    // orderDate is an required  Validating as not empty, valid String and length range.
    if (!_.isString(body.orderDate) || body.orderDate.length < 2 || body.orderDate.length > 100) {
        errorArray.push({
            field: 'orderDate',
            error: 90070,
            message: 'Please provide only valid \'orderDate\' as string, length must be between 2 and 100.'
        })
    }

    // send array if error(s)
    if (errorArray.length) {
        return generalMiddleware.standardErrorResponse(res, errorArray, 'orders.middleware.validateAddOrder')
    }

    validatedBody.name = body.name
    validatedBody.paidPrice = body.paidPrice
    validatedBody.ProductId = body.ProductId
    validatedBody.orderDate = body.orderDate

    req.body.validatedData = validatedBody

    done()
}

module.exports = {
    validateAddOrder,
    validateGetOrder
}
