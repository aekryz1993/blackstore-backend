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

export const updateWallet = ({credit, id}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const wallet = await models.Wallet.update({ credit }, {
                where: {id}
              })
            resolve(wallet)
        } catch (err) {
            reject(err)
        }
    })
}