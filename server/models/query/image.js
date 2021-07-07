import { Op } from 'sequelize'

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

export const findImage = (userIdentifier) => {
    return new Promise(async (resolve, reject) => {
        try {
            const image = await models.Image.findOne({
                where: {
                    [Op.or]: [
                        { UserId: userIdentifier },
                        { ServiceId: userIdentifier },
                        { ProductCategoryId: userIdentifier },
                        { ProductIDId: userIdentifier },
                    ]
                }
            })
            resolve(image)
        } catch (err) {
            reject(err)
        }
    })
}