import models from '../associations'

const create = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const wallet = await models.Wallet.create(body)
            resolve(wallet)
        } catch (err) {
            reject(err)
        }
    })
}

const update = ({UserId, newCredit, currency}) => {
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

const updateAll = ({UserId, dollar, euro, dinnar}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const wallet = await models.Wallet.update({dollar, euro, dinnar}, {
                where: {UserId}
              })
            resolve(wallet)
        } catch (err) {
            reject(err)
        }
    })
}

const find = (UserId) => {
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

export default {
  create,
  update,
  updateAll,
  find,
};
