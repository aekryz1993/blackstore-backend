import path from 'path'

import imageQueries from '../models/query/image'
import permissionQuaries from '../models/query/permission';
import userQueries from '../models/query/user'

const CURRENT_WORKING_DIR = process.cwd();

export const createAdmin = (redisClient) => {
    (async () => {
        try {
            const {user, isNewUser} = await userQueries.create(initUser)
            if (isNewUser) {
                const UserId = user.dataValues.id
                await redisClient.set(UserId, "0")
                const metadata = {
                    type: 'image/png',
                    name: `default.png`,
                    url: path.resolve(CURRENT_WORKING_DIR, `resource/static/assets/pictures/users/default.png`),
                    UserId
                }
                await imageQueries.create(metadata)
                await permissionQuaries.create({...permission, UserId})
                return
            }
            console.log('user already exist')
        } catch (err) {
            console.log(err.message)
        }
    })()
}

const initUser = {
    firstname: 'firstname',
    lastname: 'lastname',
    username: 'admin',
    email: 'admin@hotmail.com',
    password: 'Admin-31',
    phone: '0655544444',
    isAdmin: true,
};

const permission = {
    addProduct: true,
    updateProductPrice: true,
    updateProduct: true,
    addUser: true,
    viewUser: true,
    updateUser: true,
    updateCredit: true,
    addPayMethod: true,
    viewcmnd: true,
    confirmPayment: true,
}