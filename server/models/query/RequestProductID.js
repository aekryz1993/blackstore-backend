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

export const findAllRequestProductID = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const RequestsProductID = await models.RequestProductID.findAll()
            resolve(RequestsProductID)
        } catch (err) {
            reject(err)
        }
    })
}

export const updateIsTreatedRequestProductID = (_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const requestProductID = await models.RequestProductID.update(
                { isTreated: true }, {
                where: {
                    id: _id
                }
            })
            resolve(requestProductID)
        } catch (err) {
            reject(err)
        }
    })
}