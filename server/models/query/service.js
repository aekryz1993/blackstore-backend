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