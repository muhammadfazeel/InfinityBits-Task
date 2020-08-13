'use strict'

const orderMiddleware = require('../middlewares/order.middleware')
const orderController = require('../controllers/order.controller')
const passport = require('../config/passport')
const generalMiddleware = require('../middlewares/general.middleware')

module.exports = function (app, apiVersion) {
  const route = apiVersion

  // Add Order
  app.post(route + '/order/add', orderMiddleware.validateAddOrder, orderController.addOrder)

  // get Order
  app.get(route + '/order', orderMiddleware.validateGetOrder, orderController.getOrders)
}
