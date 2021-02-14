import User from './User'
import Service from './Service'
import ProductCategory from './ProductCategory'
import ProductID from './ProductID'
import ProductCode from './ProductCode'

Service.hasMany(ProductID)
Service.hasMany(ProductCategory)

ProductCategory.hasMany(ProductCode)
ProductCategory.belongsTo(Service, {
    foreignKey: {
        allowNull: false
    }
})

ProductCode.belongsTo(ProductCategory, {
    foreignKey: {
        allowNull: false
    }
});

ProductID.belongsTo(Service, {
    foreignKey: {
        allowNull: false
    }
});

export default {
    User,
    Service,
    ProductCategory,
    ProductCode,
    ProductID,
}