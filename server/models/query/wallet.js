import models from '../associations'

export const createWallet = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const wallet = await models.Wallet.create(body)
            resolve(wallet)
        } catch (err) {
            reject(err)
        }
    })
}

export const updateWallet = ({UserId, dollar, euro, dinnar}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const wallet = await models.Wallet.update({ dollar, euro, dinnar }, {
                where: {UserId}
              })
            resolve(wallet)
        } catch (err) {
            reject(err)
        }
    })
}

export const findWallet = (UserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const wallet = await models.Wallet.findOne({
                where: {UserId}
              })
            resolve(wallet)
        } catch (err) {
            reject(err)
        }
    })
}