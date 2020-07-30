'use strict'

const productMiddleware = require('../middlewares/product.middleware')
const productController = require('../controllers/product.controller')
const passport = require('../config/passport')
const generalMiddleware = require('../middlewares/general.middleware')

module.exports = function (app, apiVersion) {
  const route = apiVersion

  // Add Product
  app.post(route + '/products/add', generalMiddleware.attachBodyAndFiles, productMiddleware.validateAddProducts, productController.addProduct)

  // search product
  app.get(route + '/products', productMiddleware.validateSearchProducts, productController.searchProducts)

  // update product
  app.put(route + '/products/update/:id', generalMiddleware.attachBodyAndFiles, productMiddleware.validateUpdateProduct, productController.updateProduct)

  // delete product
  app.delete(route + '/products/:id/delete', passport.authenticate('jwt', { session: false }), productMiddleware.validateDeleteProduct, productController.deleteProduct)

  // To Get Product Details Against Given Id
  app.get(route + '/products/details/:id', productMiddleware.validateGetProduct, productController.getProductDetails)

  // Products To Csv
  app.get(route + '/products/csv', productController.createCSVFile)
}
