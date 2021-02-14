import models from '../associations'

export const createProductID = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const productID = await models.ProductID.create(body)
            resolve({ productID })
        } catch (err) {
            reject(err)
        }
    })
}

export const findProductID = (label) => {
    return new Promise(async (resolve, reject) => {
        try {
            const productID = await models.ProductID.findOne({
                where: {label}
            })
            resolve(productID)
        } catch (err) {
            reject(err)
        }
    })
}