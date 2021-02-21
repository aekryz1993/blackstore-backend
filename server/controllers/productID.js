import { createProductID, findProductIDById } from "../models/query/productID";
import { findServiceById } from "../models/query/service";
import { serverErrorMessage } from "../utils/messages";
import { serviceNotExist } from '../utils/messages/service'
import { productCategoryAlreadyExistMsg, productCategoryNotExistMsg, requestSuccessfulyTreated, productCategorySuccessRegistrationMsg, requestSuccessfulySent } from '../utils/messages/productCategory'
import { createRequestProductID, findAllRequestProductID, updateIsTreatedRequestProductID } from "../models/query/RequestProductID";

export const addProductID = (req, res) => {
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
         const { label } = productID.dataValues
         return res.status(201).json(productCategorySuccessRegistrationMsg(label))

      } catch (err) {
         console.log(err)
         return res.json(serverErrorMessage());
      }
   })()
}

export const sendRequestProductID = (req, res) => {
   (async () => {
      const body = req.body
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
         const RequestsProductID = await findAllRequestProductID()

         const returnRequests = () => new Promise((resolve, reject) => {
            const requestsIDBody = []
            const currentRequests = RequestsProductID.filter(requestID => !requestID.dataValues.isTreated)
            
            currentRequests.map(async (requestID, idx) => {
               try {
                  const productID = await findProductIDById(requestID.dataValues.ProductIDId)
                  const service = await findServiceById(productID.dataValues.ServiceId)
                  const RequestBody = {
                     ...requestID.dataValues,
                     productIDLabel: productID.dataValues.label,
                     serviceLabel: service.dataValues.label,
                  }
                  requestsIDBody.push(RequestBody)
                  if (idx + 1 === currentRequests.length) resolve(requestsIDBody)
               } catch (err) {
                  reject(err)
               }
            })
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

         return res.status(204).json(requestSuccessfulyTreated())

      } catch (err) {
         console.log(err)
         return res.json(serverErrorMessage());
      }
   })()
}