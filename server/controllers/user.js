import fs from "fs"

import { findImage } from '../models/query/image';
import { updatePaymentStatus } from "../models/query/payment";
import { createPermission } from "../models/query/permission";
import { countUsers, createUser, findAllUsers } from '../models/query/user'
import { updateWallet } from "../models/query/wallet";
import { serverErrorMessage } from "../utils/messages";
import { fieldAlreadyExist } from '../utils/messages/user'
import { paginateData } from './helper';
import { saveUsers } from './middleware/user';

export const addUser = (req, res, next) => {
    (async () => {
      const body = req.body
      try {
        const { user, isNewUser } = await createUser(body)

        const { username, email, phone } = user.dataValues

        if (!isNewUser) {
          return res.status(409).json(fieldAlreadyExist(username, email, phone));
        }
        await createPermission({...body.permissions, UserId: user.dataValues.id})
        req.body.associatedModelId = user.dataValues.id
        req.body.associatedModel = 'UserId'
        req.body.username = user.dataValues.username
        return next()

      } catch (err) {
        return res.json(serverErrorMessage(err.message));
      }
    })()
}

export const addMultiUser = (req, res) => {
  (async () => {
    const users = req.dataObj
    try {
      const message = await saveUsers(users)
      return res.status(201).json({message})
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })()
}

export const getAllUsers = (req, res) => {
    (async () => {
      try {
        const { page } = req.params;
        const users = []
        const { offset, limit, totalPages, totalItems, nextPage } = await paginateData(page, countUsers, 6)
        
        const initAllUsers = await findAllUsers(limit, offset)
        for (let user of initAllUsers) {
          user = user.dataValues
          let userInfo = Object.fromEntries(Object.entries(user).filter(([key, _]) => key !== 'password'))
          const image = await findImage(userInfo.id)
          userInfo = {...userInfo, image: image.dataValues.url}
          users.push(userInfo)
        }
        
        res.status(200).json({
          users,
          totalPages,
          nextPage,
          totalUsers: totalItems,
        })

      } catch (err) {
        return res.json(serverErrorMessage(err.message));
      }
    })()
}

export const updateProfilePicture = (req, res, next) => {
    (async () => {
      try {
        const id = (req.params.userId) ? req.params.userId : req.user.id
        const image = await findImage(id)
        const currentImageUrl = image.dataValues.url
        await image.destroy()
        if (!currentImageUrl.endsWith('default.png')) {
          fs.unlink(currentImageUrl, (err) => {
            if (err) throw err
          })
        }
        req.body.associatedModelId = id
        req.body.associatedModel = 'UserId'
        next()
      } catch (err) {
        return res.json(serverErrorMessage(err.message));
      }
    })()
}

export const confirmPayment = (req, res) => {
    (async () => {
      try {
        const payment = await updatePaymentStatus(req.params.id)
        if (!payment) {
          return res.status(401).json({message: 'there is not payment with that ID'})
        }

        const UserId = payment.dataValues.UserId
        const amount = payment.dataValues.amount

        const wallet = await findWallet(UserId)
        if (!wallet) {
          res.json(401).json({message: 'This wallet doesn\'t exist'})
        }
        const newCredit = wallet.dataValues.credit + amount

        await updateWallet({UserId, newCredit})

        return res.status(200).json({message: 'تم تحديث المحفظة بنجاح'})
      } catch (err) {
        return res.json(serverErrorMessage(err.message));
      }
    })()
}

export const fetchAliveCommands = (req, res) => {
    (async () => {
      try {
        let commands = await findAliveCommands()

        commands = commands.map((command) =>
          Object.fromEntries(
            Object.entries(command).filter(
              ([key, _]) => key !== "id" && key !== "isTreated"
            )
          )
        );

        return res.status(200).json({message: 'Done!', commands})
      } catch (err) {
        return res.json(serverErrorMessage(err.message));
      }
    })()
}