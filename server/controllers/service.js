import fs from "fs";

import { findImage } from "../models/query/image";
import { createService, findAllServices } from "../models/query/service";
import { serverErrorMessage } from "../utils/messages";
import { fieldAlreadyExist } from '../utils/messages/service'

export const addService = (req, res, next) => {
  (async () => {
    const body = req.body
    try {
      const { service, isNewService } = await createService(body)
      const { label } = service.dataValues
      if (!isNewService) {
        return res.status(409).json(fieldAlreadyExist(label));
      }
      req.body.associatedModelId = service.dataValues.id
      req.body.associatedModel = 'ServiceId'
      return next()

    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })()
}

export const fetchAllServices = (req, res) => {
  (async () => {
    try {
      const services = await findAllServices()
      return res.json({services})
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })()
}

export const updateServicePicture = (req, res, next) => {
    (async () => {
      try {
        const {id, label} = req.body
        const image = await findImage(id)
        if (image) {
          const currentImageUrl = image.dataValues.url
          await image.destroy()
          if (!currentImageUrl.endsWith('default.png')) {
            fs.unlink(currentImageUrl, (err) => {
              if (err) throw err
            })
          }
          req.body.associatedModelId = id
          req.body.associatedModel = 'ServiceId'
          req.body.label = label

          next()
        } else {
          throw 'error'
        }
      } catch (err) {
        return res.json(serverErrorMessage(err.message));
      }
    })()
}