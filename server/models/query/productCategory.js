import models from '../associations'

export const createProductCategory = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const productCategory = await models.ProductCategory.create(body)
            resolve({ productCategory })
        } catch (err) {
            reject(err)
        }
    })
}

export const findProductCategory = (label) => {
    return new Promise(async (resolve, reject) => {
        try {
            const productCategory = await models.ProductCategory.findOne({
                where: {label}
            })
            resolve(productCategory)
        } catch (err) {
            reject(err)
        }
    })
}

export const findAllProductCategory = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const productCategory = await models.ProductCategory.findAll()
            resolve(productCategory)
        } catch (err) {
            reject(err)
        }
    })
}

export const findProductCategoryById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const productCategory = await models.ProductCategory.findByPk(id, {
                include: models.ProductCode,
            })
            resolve(productCategory)
        } catch (err) {
            reject(err)
        }
    })
}

export const updatePrice = ({id, priceCoin, pricePoint}) => {
    return new Promise(async (resolve, reject) => {
        try {
            await models.ProductCategory.update({ priceCoin, pricePoint }, {
                where: {id}
              });
            resolve({message: 'تم تحديث السعر بنجاح'})
        } catch (err) {
            reject(err)
        }
    })
}