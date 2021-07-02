import { createPicture } from '../models/query/image'
import { createUser } from '../models/query/user'

export const createAdmin = () => {
    (async () => {
        try {
            const {user, isNewUser} = await createUser(initUser)
            if (isNewUser) {
                const metadata = {
                    type: 'image/png',
                    name: `default.png`,
                    url: path.resolve(CURRENT_WORKING_DIR, `resource/static/assets/pictures/users/default.png`),
                    UserId: user.dataValues.id
                }
                await createPicture(metadata)
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