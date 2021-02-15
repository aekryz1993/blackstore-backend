import models from '../associations'

export const createRequestProductID = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const requestProductID = await models.RequestProductID.create(body)
            resolve(requestProductID)
        } catch (err) {
            reject(err)
        }
    })
}
