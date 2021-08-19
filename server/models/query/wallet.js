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

export const updateWallet = ({UserId, newCredit, currency}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const wallet = await models.Wallet.update({[currency]: newCredit}, {
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