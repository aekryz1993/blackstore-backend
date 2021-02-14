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