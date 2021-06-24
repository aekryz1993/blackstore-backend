import User from './User'
import Service from './Service'
import ProductCategory from './ProductCategory'
import ProductID from './ProductID'
import ProductCode from './ProductCode'
import RequestProductID from './RequestProductID'
import Image from './Image'

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

ProductID.hasMany(RequestProductID)
RequestProductID.belongsTo(ProductID, {
    foreignKey: {
        allowNull: false
    }
});

User.hasMany(RequestProductID)
User.hasMany(ProductCode)

Service.hasOne(Image)
ProductCategory.hasOne(Image)
ProductID.hasOne(Image)
User.hasOne(Image)

export default {
    User,
    Service,
    ProductCategory,
    ProductCode,
    ProductID,
    RequestProductID,
    Image,
}