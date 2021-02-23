// import fs from "fs";

// import { createPicture } from "../models/query/image";
import { createService } from "../models/query/service";
import { serverErrorMessage } from "../utils/messages";
import { fieldAlreadyExist, successRegistration } from '../utils/messages/service'

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
        console.log(err)
        return res.json(serverErrorMessage());
      }
    })()
}