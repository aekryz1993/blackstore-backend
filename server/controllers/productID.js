import fs from "fs"

import { createProductID, findProductIDById } from "../models/query/productID";
import { findServiceById } from "../models/query/service";
import { serverErrorMessage } from "../utils/messages";
import { serviceNotExist } from '../utils/messages/service'
import { productCategoryAlreadyExistMsg, productCategoryNotExistMsg, requestSuccessfulyTreated, requestSuccessfulySent } from '../utils/messages/productCategory'
import { createRequestProductID, findRequestProductIDById, findRequestsProductID, updateIsTreatedRequestProductID } from "../models/query/RequestProductID";
import { findUserById } from "../models/query/user";
import { findImage } from "../models/query/image";
import { findWallet, updateWallet } from "../models/query/wallet";

export const addProductID = (req, res, next) => {
   (async () => {
      const body = req.body
      try {
         const service = await findServiceById(body.ServiceId)
         if (service === null) {
            return res.status(401).json(serviceNotExist(body.serviceName))
         }

         const checkExistProductID = service.dataValues.ProductIDs.filter(ProductIDItem => ProductIDItem.dataValues.label === body.label)
         if (checkExistProductID.length !== 0) {
            return res.status(409).json(productCategoryAlreadyExistMsg(body.label))
         }

         const { productID } = await createProductID(body)
         req.body.associatedModelId = productID.dataValues.id
         req.body.associatedModel = 'ProductIDId'
         req.body.label = productID.dataValues.label
         return next()

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
      const body = req.body
      try {
         const isTreated = await updateIsTreatedRequestProductID(body.requestIDid)
         if (!isTreated[0]) {
            throw 'Operation failed'
         }
         // const requestId = await findRequestProductIDById(body.requestIDid)
         // const UserId = requestId.UserId.id
         // const productPrice = requestId.ProductIDId.pricePoint
         // const wallet = await findWallet(UserId)
         // const newCredit = wallet.dataValues.credit - productPrice
         // await updateWallet({UserId, newCredit})
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

export const updateProductIDPicture = (req, res, next) => {
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
         req.body.associatedModel = 'ProductIDId'
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