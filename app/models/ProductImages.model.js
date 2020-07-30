'use strict'

module.exports = function (sequelize, DataTypes) {
  let ProductImage = sequelize.define('ProductImage', {
    url: {
      type: DataTypes.STRING(150)
    }
  }, {
    associate: function (models) {
      ProductImage.belongsTo(models.Product, { foreignKey: 'ProductId', as: 'product' })
    }
  })
  return ProductImage
}
