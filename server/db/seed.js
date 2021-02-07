import { createUser } from '../models/query/user'

export const createAdmin = () => {
    (async () => {
        try {
            const {user, isNewUser} = await createUser(initUser)
            // console.log(user.dataValues)
            // console.log(isNewUser)
            // const { username, email, phone } = targetUser
            // if (!isNewUser) res.status(409).json(fieldAlreadyExist(username, email, phone));
            if (!isNewUser) console.log('user already exist')
            // res.status(201).json(successRegistration())
        } catch (err) {
            // res.send(err)
            console.log(err)
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