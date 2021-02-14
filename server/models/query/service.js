import models from '../associations'

export const createService = (body) => {
    const { label } = body

    return new Promise(async (resolve, reject) => {
        try {
            const [service, isNewService] = await models.Service.findOrCreate({
                where: { label: label },
                defaults: body
            })

            resolve({ service, isNewService })
        } catch (err) {
            reject(err)
        }
    })
}

export const findService = (serviceName) => {
    return new Promise(async (resolve, reject) => {
        try {
            const service = await models.Service.findOne({
                where: {label: serviceName}
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
                include: models.ProductCategory
            })
            resolve(service)
        } catch (err) {
            reject(err)
        }
    })
}