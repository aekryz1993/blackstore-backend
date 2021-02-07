import User from './User'
import Service from './Service'
import ProductCategory from './ProductCategory'
import ProductID from './ProductID'
import ProductCode from './ProductCode'

Service.hasMany(ProductID)
Service.hasMany(ProductCategory)

ProductCategory.hasMany(ProductCode)
ProductCategory.belongsTo(Service)

ProductCode.belongsTo(ProductCategory);

ProductID.belongsTo(Service);

export default {
    User,
    Service,
    ProductCategory,
    ProductCode,
    ProductID,
}
