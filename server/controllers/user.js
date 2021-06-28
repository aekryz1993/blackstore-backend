import { countUsers, createUser, findAllUsers } from '../models/query/user'
import { serverErrorMessage } from "../utils/messages";
import { fieldAlreadyExist } from '../utils/messages/user'

export const addUser = (req, res, next) => {
    (async () => {
      const body = req.body
      try {
        const { user, isNewUser } = await createUser(body)

        const { username, email, phone } = user.dataValues

        if (!isNewUser) {
          return res.status(409).json(fieldAlreadyExist(username, email, phone));
        }

        req.body.associatedModelId = user.dataValues.id
        req.body.associatedModel = 'UserId'
        req.body.username = user.dataValues.username
        return next()

      } catch (err) {
        return res.json(serverErrorMessage(err.message));
      }
    })()
}

export const getAllUsers = (req, res) => {
    (async () => {
      try {
        const { page } = req.query;
        const users = []
        const limit = 3
        const offset = page ? limit * page : 0
        const totalUsers = await countUsers()
        const totalPages = Math.ceil(totalUsers / limit);
        const nextPage = (totalPages === Number(page)+1) ? -1 : Number(page) + 1
        const initAllUsers = await findAllUsers(limit, offset)
        for (let user of initAllUsers) {
          user = user.dataValues
          const userInfo = Object.fromEntries(Object.entries(user).filter(([key, _]) => key !== 'id' && key !== 'password'))
          users.push(userInfo)
        }
        
        res.status(200).json({
          users,
          totalPages,
          nextPage,
          totalUsers,
        })

      } catch (err) {
        return res.json(serverErrorMessage(err.message));
      }
    })()
}