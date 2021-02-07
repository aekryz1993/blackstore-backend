import { createUser } from '../models/query/user'
import { fieldAlreadyExist, successRegistration } from '../utils/messages/user'

export const addUser = (req, res) => {

  const { body } = req

    (async () => {
      try {
        const { user, isNewUser } = await createUser(body)

        const { username, email, phone } = user.dataValues

        if (!isNewUser) res.status(409).json(fieldAlreadyExist(username, email, phone));

        res.status(201).json(successRegistration())

      } catch (err) {
        res.send(err)
      }
    })()
}