import models from '../associations'

export const createProductCode = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const productCode = await models.ProductCode.create(body)
            resolve({ productCode })
        } catch (err) {
            reject(err)
        }
    })
}

export const findProductCode = (code) => {
    return new Promise(async (resolve, reject) => {
        try {
            const productCode = await models.ProductCode.findOne({
                where: {code}
            })
            resolve(productCode)
        } catch (err) {
            reject(err)
        }
    })
}

export const findAllProductCodes = (quantity, categoryId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const productCodes = await models.ProductCode.findAll({
                where: {
                    ProductCategoryId: categoryId,
                    sold: false,
                },
                limit: quantity,
            })
            resolve(productCodes)
        } catch (err) {
            reject(err)
        }
    })
}

export const updateProductCode = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await models.ProductCode.update({ sold: true }, {
                where: {
                    id
                },
            })
            resolve('updated')
        } catch (err) {
            reject(err)
        }
    })
}