import { createProductID, findProductIDById } from "../models/query/productID";
import { findServiceById } from "../models/query/service";
import { serverErrorMessage } from "../utils/messages";
import { serviceNotExist } from '../utils/messages/service'
import { productCategoryAlreadyExistMsg, productCategoryNotExistMsg, productCategorySuccessRegistrationMsg, requestSuccessfulySent } from '../utils/messages/productCategory'
import { createRequestProductID } from "../models/query/RequestProductID";

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