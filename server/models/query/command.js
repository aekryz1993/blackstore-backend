import models from '../associations'

export const createCommand = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const command = await models.Command.create(body)
            resolve(command)
        } catch (err) {
            reject(err)
        }
    })
}