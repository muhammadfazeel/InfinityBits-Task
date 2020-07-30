'use strict'

module.exports = function (sequelize, DataTypes) {
  let Product = sequelize.define('Product',
    {
      title: {
        type: DataTypes.STRING(100),
        require: true
      },
      price: {
        type: DataTypes.INTEGER,
        require: true
      },
      thumbnail: {
        type: DataTypes.STRING(100)
      },
      description: {
        type: DataTypes.STRING(10000),
        require: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      priority: {
        type: DataTypes.INTEGER,
        defaultValue: 5
      }
    }, {
      associate: function (models) {
        Product.hasMany(models.ProductImage, { as: 'images' })
        Product.hasMany(models.Order, { as: 'productOrder' })
      }
    }
  )

  return Product
}
