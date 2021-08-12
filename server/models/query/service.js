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

export const findService = (serviceName, serviceCategory) => {
    return new Promise(async (resolve, reject) => {
        try {
            const service = await models.Service.findOne({
                where: {
                    label: serviceName,
                    category: serviceCategory,
                },
                include: [models.ProductCategory, models.ProductID],
            })
            resolve(service)
        } catch (err) {
            reject(err)
        }
    })
}

export const findServiceById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const service = await models.Service.findByPk(id, {
                include: [models.ProductCategory, models.ProductID],
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
                include: [includeModel, models.Image],
            })
            resolve(services)
        } catch (err) {
            reject(err)
        }
    })
}