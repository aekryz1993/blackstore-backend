import { createService } from "../models/query/service";
import { serverErrorMessage } from "../utils/messages";
import { fieldAlreadyExist, successRegistration } from '../utils/messages/service'

export const addService = (req, res) => {
    (async () => {
      const body = req.body
      try {
        const { service, isNewService } = await createService(body)

        const { label } = service.dataValues

        if (!isNewService) {
          return res.status(409).json(fieldAlreadyExist(label));
        }

        return res.status(201).json(successRegistration(label))

      } catch (err) {
        return res.json(serverErrorMessage());
      }
    })()
}