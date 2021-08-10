import User from './User'
import Service from './Service'
import ProductCategory from './ProductCategory'
import ProductID from './ProductID'
import ProductCode from './ProductCode'
import RequestProductID from './RequestProductID'
import Image from './Image'
import Wallet from './Wallet'
import Command from './Command'
import Payment from './Payment'
import PayMethod from './PayMethod'
import Permission from './Permission'
import Price from './Price'

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

Wallet.belongsTo(User)
Command.belongsTo(User)
Permission.belongsTo(User)

Price.belongsTo(ProductCategory)
Price.belongsTo(ProductID)

User.hasMany(RequestProductID)
User.hasMany(Command)
User.hasMany(Payment)

Service.hasOne(Image)
ProductCategory.hasOne(Image)
ProductCategory.hasOne(Price)
ProductID.hasOne(Image)
ProductID.hasOne(Price)
User.hasOne(Image)
User.hasOne(Wallet)
User.hasOne(Permission)

Payment.hasOne(Image)

Payment.belongsTo(User)

export default {
    User,
    Service,
    ProductCategory,
    ProductCode,
    ProductID,
    RequestProductID,
    Image,
    Wallet,
    Command,
    Payment,
    PayMethod,
    Permission,
    Price,
}