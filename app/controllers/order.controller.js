'use strict'
const SERVER_RESPONSE = require('../config/serverResponses')
const orderHelper = require('../helpers/order.helper')
const StandardError = require('standard-error')
const generalController = require('./general.controller')

// **********************
// Search orders
// **********************

const getOrders = function (req, res) {
  return orderHelper.getOrders(req.conditions, req.limit, req.offset)
    .then(function (data) {
      generalController.successResponse(res, 'orders searched successfully.', data, 'order.controller.getOrders')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(res, err, null, 'order.controller.getOrders', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(res, err, 'Please check originalError for details', 'order.controller.getOrders', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}


// ***********************************
// Add New order
// ***********************************

const addOrder = function (req, res) {
  return orderHelper.addOrder(req.body.validatedData)
    .then(function (data) {
      generalController.successResponse(res, 'Order Added successfully.', data, 'order.controller.addOrder')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(res, err, null, 'order.controller.addOrder', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(res, err, 'Please check originalError for details', 'order.controller.addOrder', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

module.exports = {
  getOrders,
  addOrder
}
