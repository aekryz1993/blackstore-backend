import models from '../associations'

export const findPermission = (UserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const permission = await models.Permission.findOne({
                where: {UserId}
            })
            resolve(permission)
        } catch (err) {
            reject(err)
        }
    })
}

export const createPermission = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            await models.Permission.create(body)
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}