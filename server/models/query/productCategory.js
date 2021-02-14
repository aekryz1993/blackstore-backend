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