import models from '../associations'

export const createPicture = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const image = await models.Image.create(body)
            resolve(image)
        } catch (err) {
            reject(err)
        }
    })
}