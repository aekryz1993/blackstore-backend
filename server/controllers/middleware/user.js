import path from "path"
import { createPicture } from "../../models/query/image"

import { createUser } from "../../models/query/user"
import { createWallet } from "../../models/query/wallet"

const CURRENT_WORKING_DIR = process.cwd();

export const saveUsers = (users) => {
    return new Promise(async (resolve, reject) => {
        let exist = []
        let notExist = false
        try {
            for (let i in users) {
                const firstname = users[i]["nom"]
                const lastname = users[i]["prénom"]
                const username = users[i]["username"]
                const password = users[i]["mot de passe"]
                const email = users[i]["email"]
                const phone = String(users[i]["phone"])
                const credit = users[i]["credit"]

                const {user, isNewUser} = await createUser({firstname, lastname, username, password, email, phone})
                if (!isNewUser) {
                    exist = [...exist, username]
                } else {
                    notExist = true
                    const UserId = user.dataValues.id
                    await createPermission({UserId})
                    await createWallet({credit, UserId})
                    const imageBody = {
                        type: 'image/png',
                        name: `default.png`,
                        url: path.resolve(CURRENT_WORKING_DIR, `resource/static/assets/pictures/users/default.png`),
                        UserId,
                    }
                    await createPicture(imageBody)
                }
            }
        } catch (error) {
            console.log(error)
            reject(error.message)
        }
        if (!notExist) {
            reject({message: 'جميع العملاء تم إضافتهم مسبقا'})
        }
        if (exist.length !== 0) {
            resolve({
                message: 'تم إضافة بعض العملاء بنجاح',
                exist
            })
        } else {
            resolve({message: 'تم إضافة كل العملاء بنجاح'})
        }
    }) 
}