import { createUser, findAllUsers } from '../models/query/user'
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
        const users = []
        const initAllUsers = await findAllUsers()
        for (let user of initAllUsers) {
          user = user.dataValues
          const userInfo = Object.fromEntries(Object.entries(user).filter(([key, _]) => key !== 'id' && key !== 'password'))
          users.push(userInfo)
        }

        res.status(200).send(users)

      } catch (err) {
        return res.json(serverErrorMessage(err.message));
      }
    })()
}