import { createUser } from "../../models/query/user"
import { createWallet } from "../../models/query/wallet"
import { forbiddenActivePremission, forbiddenAdminPremission, forbiddenSessionPremission } from "../../utils/messages/user"

export const checkAdminPermission = (req, res, next) => {
    const _isAdmin = req.user.dataValues.isAdmin
    
    if (!_isAdmin) res.status(403).json(forbiddenAdminPremission())
    next() 
}

export const checkActivePermission = (req, res, next) => {
    const _isActive = req.user.dataValues.isActive
    
    if (!_isActive) res.status(403).json(forbiddenActivePremission())
    next() 
}

export const checkSessionPermission = (req, res, next) => {
    const {id} = req.body
    const isCurrentUser = req.user.dataValues.id === id
    
    if (!isCurrentUser) res.status(403).json(forbiddenSessionPremission())
    next() 
}

export const saveUsers = (users) => {
    return new Promise(async (resolve, reject) => {
        let exist = []
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
                    exist = {...exist, username}
                } else {
                    const UserId = user.dataValues.id
                    await createWallet({credit, UserId})
                }
            }
        } catch (error) {
            console.log(error)
            reject(error.message)
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