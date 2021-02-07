import { createUser } from '../models/query/user'
import { serverErrorMessage } from "../utils/messages";
import { fieldAlreadyExist, successRegistration } from '../utils/messages/user'

export const addUser = (req, res) => {
    (async () => {
      const body = req.body
      try {
        const { user, isNewUser } = await createUser(body)

        const { username, email, phone } = user.dataValues

        if (!isNewUser) res.status(409).json(fieldAlreadyExist(username, email, phone));

        res.status(201).json(successRegistration())

      } catch (err) {
        return res.json(serverErrorMessage());
      }
    })()
}