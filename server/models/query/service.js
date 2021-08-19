import models from '../associations'

export const createService = (body) => {
    const { label, category } = body
    return new Promise(async (resolve, reject) => {
        try {
            const [service, isNewService] = await models.Service.findOrCreate({
                where: { 
                    label,
                    category,
                },
                defaults: body
            })

            resolve({ service, isNewService })
        } catch (err) {
            reject(err)
        }
    })
}

export const findService = (serviceName, category) => {
    const includeModel = category === 'code' ? models.ProductCategory : models.ProductID
    return new Promise(async (resolve, reject) => {
        try {
            const service = await models.Service.findOne({
                where: {
                    label: serviceName,
                    category,
                },
                include: [
                    {model: includeModel, include: models.Price},
                    models.Image
                ],
            })
            resolve(service)
        } catch (err) {
            reject(err)
        }
    })
}

export const findServiceById = (id, category) => {
    const includeModel = category === 'code' ? models.ProductCategory : models.ProductID
    return new Promise(async (resolve, reject) => {
        try {
            const service = await models.Service.findByPk(id, {
                include: [
                    {model: includeModel, include: models.Price},
                    models.Image
                ],
            })
            resolve(service)
        } catch (err) {
            reject(err)
        }
    })
}

export const findServices = (category) => {
    const includeModel = category === 'code' ? models.ProductCategory : models.ProductID
    return new Promise(async (resolve, reject) => {
        try {
            const services = await models.Service.findAll({
                where: {category},
                include: [
                    {model: includeModel, include: models.Price},
                    models.Image
                ],
            })
            resolve(services)
        } catch (err) {
            reject(err)
        }
    })
}