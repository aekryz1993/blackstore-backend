import {Op} from 'sequelize'

import models from '../associations'

export const createUser = (body) => {
    const {
        username,
        email,
        phone,
    } = body

    return new Promise(async (resolve, reject) => {
        try {
            const [user, isNewUser] = await models.User.findOrCreate({
                where: {
                    [Op.or]: [
                        { username: username },
                        { email: email },
                        { phone: phone }
                    ]
                },
                defaults: body
            })

            resolve({ user, isNewUser })
        } catch (err) {
            reject(err)
        }
    })
}

export const findUser = (userIdentifier) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await models.User.findOne({
                where: {
                    [Op.or]: [
                        { username: userIdentifier },
                        { email: userIdentifier },
                        { phone: userIdentifier }
                    ]
                }
            })
            resolve(user)
        } catch (err) {
            reject(err)
        }
    })
}

export const findUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await models.User.findByPk(id)
            resolve(user)
        } catch (err) {
            reject(err)
        }
    })
}

export const findAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUsers = await models.User.findAll({
                where: {isAdmin: false}
            })
            resolve(allUsers)
        } catch (err) {
            reject(err)
        }
    })
}