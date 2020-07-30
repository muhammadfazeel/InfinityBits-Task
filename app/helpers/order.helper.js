'use strict'
const db = require('../config/sequelize.config')
const generalHelpingMethods = require('./general.helper')
const helpingHelperMethods = require('./helping.helper')
const _ = require('lodash')

// ********************
// To Get Products
// ********************

function getOrders(conditions, limit, offset) {
  return db.Order.findAndCountAll({
    conditions,
    limit: limit,
    offset: offset
  })
}

// ********************
// To Add New Order
// ********************

function addOrder(data) {
  return db.Order.create(data)
    .then(async (createdOrder) => {
      if (createdOrder) {
        let temp = {}
        temp.orderData = createdOrder
        let productInfo = await db.Product.findOne({
          where: { id: data.ProductId},
          raw: true
        })
        temp.productData = productInfo
        let mail = await helpingHelperMethods.sendMail(temp)
        temp.mail = mail
        return temp
      }
    })
}

module.exports = {
  getOrders,
  addOrder
}
