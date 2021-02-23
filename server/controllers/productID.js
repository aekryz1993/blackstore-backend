import { createProductID, findProductIDById } from "../models/query/productID";
import { findServiceById } from "../models/query/service";
import { serverErrorMessage } from "../utils/messages";
import { serviceNotExist } from '../utils/messages/service'
import { productCategoryAlreadyExistMsg, productCategoryNotExistMsg, requestSuccessfulyTreated, requestSuccessfulySent } from '../utils/messages/productCategory'
import { createRequestProductID, findRequestsProductID, updateIsTreatedRequestProductID } from "../models/query/RequestProductID";
import { findUserById } from "../models/query/user";

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
         console.log(err)
         return res.json(serverErrorMessage());
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
         console.log(err)
         return res.json(serverErrorMessage());
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
         console.log(err)
         return res.json(serverErrorMessage());
      }
   })()
}

export const treatedRequestProductID = (req, res) => {
   (async () => {
      const body = req.body
      try {
         await updateIsTreatedRequestProductID(body.requestIDid)

         return res.status(200).json(requestSuccessfulyTreated())

      } catch (err) {
         console.log(err)
         return res.json(serverErrorMessage());
      }
   })()
}