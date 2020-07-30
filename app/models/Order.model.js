'use strict'

module.exports = function (sequelize, DataTypes) {
  let Order = sequelize.define('Order',
    {
      name: {
        type: DataTypes.STRING(100),
        require: true
      },
      email: {
        type: DataTypes.STRING(150),
        require: true
      },
      paidPrice: {
        type: DataTypes.INTEGER,
        require: true
      },
      orderDate: {
          type: DataTypes.DATEONLY
      }
    }, {
      associate: function (models) {
        Order.belongsTo(models.Product, { foreignKey: 'ProductId', as: 'productOrder' })
      }
    }
  )

  return Order
}
