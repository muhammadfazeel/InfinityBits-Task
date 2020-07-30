'use strict'
const db = require('../config/sequelize.config')
const generalHelpingMethods = require('./general.helper')
const helpingHelperMethods = require('./helping.helper')
const _ = require('lodash')
const JSONToCSV = require('json2csv').parse
const FileSystem = require('fs')
// const fff = require('')

// ********************
// To Get Products
// ********************

function searchProducts(conditions, limit, offset) {
  // Sequelize
  const condition = {}
  condition.isDeleted = false
  if (conditions.id) {
    condition.id = conditions.id

  }
  if (conditions.title) {
    condition.title = {
      [Op.like]: '%' + conditions.title + '%'
    }
  }

  if (conditions.maxPrice && conditions.minPrice) {
    condition.price = {
      [Op.gte]: conditions.maxPrice,
      [Op.lte]: conditions.minPrice
    }
  }
  else if (conditions.maxPrice) {
    condition.price = {
      [Op.gte]: conditions.maxPrice
    }
  }
  else if (conditions.minPrice) {
    condition.price = {
      [Op.lte]: conditions.minPrice
    }
  }
  return db.Product.findAndCountAll({
    condition,
    include: [{
      model: db.ProductImage,
      as: 'images',
      attributes: ['id', 'url', 'createdAt']
    }],
    limit: limit,
    offset: offset,
    order: [['priority', 'ASC']],
  })
}

// **********************
// To Update New Product
// **********************

const updateProduct = (data, id, files) => {
  return db.Product.findOne({
    where: {
      id: id,
      isDeleted: false
    }
  })
    .then((product) => {
      if (_.isEmpty(product)) {
        // Product not found, return error
        return generalHelpingMethods.rejectPromise([{
          field: 'id',
          error: 1572,
          message: 'Product not found.'
        }])
      }
      if (data) {
        // Update product
        product.update(data, { where: { id: id.id } })
      }

      // To Delete Image
      if (data.deleteImage) {
        db.ProductImage.findAll({ where: { id: data.deleteImage } })
          .then((image) => {
            if (image) {
              db.ProductImage.destroy({ where: { id: data.deleteImage } })
            }
          })
      }

      if (files && files.length) {
        let thumbnail = JSON.parse(data.thumbnailObject)
        // upload images
        uploadFiles(id, files)
          .then((insertedImages) => {
            // data.thumbnailIndex
            if (thumbnail.type === 'index') {
              // data.thumbnailIndex
              if (thumbnail.value !== '' && thumbnail.value !== undefined && thumbnail.value != null) {
                product.thumbnail = insertedImages[thumbnail.value].url
                return product.save()
              }
            }
          })
      }
      let thumbnailValue = JSON.parse(data.thumbnailObject)
      if (thumbnailValue.type === 'url') {
        product.thumbnail = thumbnailValue.value
        product.save()
      }
    })
}

// ********************
// To Delete Product
// ********************

const deleteProduct = (input) => {
  // to delete record permanently

  // return db.Product.destroy({
  //   where: { id: input.id}
  // })

  // To Keep Record Save Change its status from isDeleted false to true
  return db.Product.findOne({
    where: {
      id: input.id,
      isDeleted: false
    }
  })
    .then((product) => {
      if (_.isEmpty(product)) {
        // Employee not found, return error
        return generalHelpingMethods.rejectPromise([{
          field: 'id',
          error: 1575,
          message: 'No product found against given id.'
        }])
      }
      // employee found, change value of isDeleted to true
      product.isDeleted = true
      // save employee
      product.save()
      return true
    })
}

// ********************
// To Add New Product
// ********************

function addProduct(data, files) {
  return db.Product.create(data)
    .then((createdProduct) => {
      if (files) {
        // upload images
        uploadFiles(createdProduct.id, files)
          .then((insertedImages) => {
            // data.thumbnailIndex
            console.log(insertedImages)
            if (data.thumbnailIndex != '' && data.thumbnailIndex != undefined && data.thumbnailIndex != null) {
              createdProduct.thumbnail = insertedImages[data.thumbnailIndex].url
              return createdProduct.save()
            }
          })
      }
    })
}

// This is private method, not exported.
const uploadFiles = async (ProductId, files) => {
  const urlArray = []
  for (let k = 0; k < files.length; k++) {
    await helpingHelperMethods.uploadFile(files[k], files[k].name)
      .then((images) => {
        urlArray.push({
          url: images.Location,
          ProductId: ProductId
        })
      })
      .catch(generalHelpingMethods.catchException)
  }
  return db.ProductImage.bulkCreate(urlArray)
    .map(el => el.get({ plain: true }))
}

// **********************************
// To Get Product Details Against Id
// **********************************

function getProductDetails(conditions) {
  return db.Product.findOne({
    where: { id: conditions.id },
    include: [
      {
        model: db.ProductImage,
        as: 'images',
        attributes: ['id', 'url', 'createdAt']
      }
    ]
  })
}

function createCSVFile(condition) {
  return db.Product.findAll({
    where: condition,
    raw: true
  })
    .then((products) => {
      const csv = JSONToCSV(products, { fields: ['id', 'title', 'price', 'thumbnail', 'description', 'isActive', 'isDeleted', 'Priority', 'CreatedAt', 'updateAt'] })
      FileSystem.writeFileSync('./products.csv', csv)
    })
}

module.exports = {
  searchProducts,
  updateProduct,
  deleteProduct,
  addProduct,
  getProductDetails,
  createCSVFile
}
