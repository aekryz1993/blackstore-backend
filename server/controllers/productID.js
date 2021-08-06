import fs from "fs"

import { createProductID, findProductIDById } from "../models/query/productID";
import { findService, findServiceById } from "../models/query/service";
import { serverErrorMessage } from "../utils/messages";
import { serviceNotExist, successRegistration } from '../utils/messages/service'
import { productCategoryAlreadyExistMsg, productCategoryNotExistMsg, requestSuccessfulyTreated, requestSuccessfulySent } from '../utils/messages/productCategory'
import { createRequestProductID, findRequestsProductID, updateIsTreatedRequestProductID } from "../models/query/RequestProductID";
import { findUserById } from "../models/query/user";
import { findImage } from "../models/query/image";
import { createPrice } from "../models/query/price";

export const addProductID = (req, res) => {
   (async () => {
      const {serviceName, label, dollar, euro, dinnar} = req.body
      try {
         const service = await findService(serviceName, 'id')
         if (service === null) {
            return res.status(401).json(serviceNotExist(serviceName))
         }

         const checkExistProductID = service.dataValues.ProductIDs.filter(ProductIDItem => ProductIDItem.dataValues.label === label)
         if (checkExistProductID.length !== 0) {
            return res.status(409).json(productCategoryAlreadyExistMsg(label))
         }

         const { productID } = await createProductID({label, ServiceId: service.dataValues.id})
			const bodyPrice = {
				dollar,
				euro,
				dinnar,
				ProductIDId: productID.dataValues.id
			}
         await createPrice(bodyPrice);
         return res.status(201).json(successRegistration(label))
      } catch (err) {
         return res.json(serverErrorMessage(err.message));
      }
   })()
}

export const sendRequestProductID = (req, res) => {
   (async () => {
      const body = { ...req.body, UserId: req.user.dataValues.id }
      try {
         const productID = await findProductIDById(body.ProductIDId)

         if (productID === null) {
            return res.status(401).json(productCategoryNotExistMsg(body.productIdLabel))
         }

         await createRequestProductID(body)

         return res.status(201).json(requestSuccessfulySent())

      } catch (err) {
         return res.json(serverErrorMessage(err.message));
      }
   })()
}

export const fetchAllRequestsProductID = (req, res) => {
   (async () => {
      try {
         const requestsProductID = await findRequestsProductID()
         const returnRequests = () => new Promise((resolve, reject) => {
            const requestsIDBody = []
            if (requestsProductID.length !== 0) {
               requestsProductID.map(async (requestID, idx) => {
                  try {
                     const productID = await findProductIDById(requestID.dataValues.ProductIDId)
                     const user = await findUserById(requestID.dataValues.UserId)
                     const service = await findServiceById(productID.dataValues.ServiceId)
                     const RequestBody = {
                        ...requestID.dataValues,
                        productIDLabel: productID.dataValues.label,
                        serviceLabel: service.dataValues.label,
                        username: user.dataValues.username,
                        requestDate: user.dataValues.createdAt,
                     }
                     requestsIDBody.push(RequestBody)
                     if (idx + 1 === requestsProductID.length) resolve(requestsIDBody)
                  } catch (err) {
                     reject(err)
                  }
               })
            } else {
               resolve(requestsIDBody)
            }
         })
         const requestsIDBody = await returnRequests()
         return res.status(200).json(requestsIDBody)
      } catch (err) {
         return res.json(serverErrorMessage(err.message));
      }
   })()
}

export const treatedRequestProductID = (req, res) => {
   (async () => {
      try {
         const isTreated = await updateIsTreatedRequestProductID(req.params.id)
         if (!isTreated[0]) {
            throw 'Operation failed'
         }
         return res.status(200).json(requestSuccessfulyTreated())

      } catch (err) {
         return res.json(serverErrorMessage(err.message));
      }
   })()
}

export const fetchProductIDsByService = (req, res) => {
   (async () => {
      const {ServiceId, serviceName} = req.query
      try {
         const service = await findServiceById(ServiceId)
         if (service === null) {
            return res.status(401).json(serviceNotExist(serviceName))
         }
         return res.status(200).json(service.ProductIDs)
      } catch (err) {
         return res.json(serverErrorMessage(err.message));
      }
   })()
}