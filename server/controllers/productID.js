import productIDQueries from "../models/query/productID";
import serviceQueries from "../models/query/service";
import requestProductIDQueries from "../models/query/requestProductID";
import userQueries from "../models/query/user";
import priceQueries from "../models/query/price";
import { serverErrorMessage } from "../utils/messages";
import { serviceNotExist, successRegistration } from '../utils/messages/service'
import { productCategoryAlreadyExistMsg, productCategoryNotExistMsg, requestSuccessfulyTreated, requestSuccessfulySent } from '../utils/messages/productCategory'

export const addProductID = (req, res) => {
   (async () => {
      const {serviceName, label, isAvailable, dollar, euro, dinnar} = req.body
      try {
         const service = await serviceQueries.findByNameAndCategory(serviceName, 'id')
         if (service === null) {
            return res.status(401).json(serviceNotExist(serviceName))
         }

         const checkExistProductID = service.dataValues.ProductIDs.filter(ProductIDItem => ProductIDItem.dataValues.label === label)
         if (checkExistProductID.length !== 0) {
            return res.status(409).json(productCategoryAlreadyExistMsg(label))
         }

         const { productID } = await productIDQueries.create({label, isAvailable, ServiceId: service.dataValues.id})
			const bodyPrice = {
				dollar,
				euro,
				dinnar,
				ProductIDId: productID.dataValues.id
			}
         await priceQueries.create(bodyPrice);
         return res.status(201).json(successRegistration(productID.dataValues))
      } catch (err) {
         return res.json(serverErrorMessage(err.message));
      }
   })()
}

export const sendRequestProductID = (req, res) => {
   (async () => {
      const body = { ...req.body, UserId: req.user.dataValues.id }
      const currentcoin = req.params.currentcoin
      try {
         const productID = await productIDQueries.findById(body.ProductIDId)

         if (productID === null) {
            return res.status(401).json(productCategoryNotExistMsg(body.productIdLabel))
         }

         await requestProductIDQueries.create(body)

         return res.status(201).json(requestSuccessfulySent())

      } catch (err) {
         return res.json(serverErrorMessage(err.message));
      }
   })()
}

export const fetchAllRequestsProductID = (req, res) => {
   (async () => {
      try {
         const requestsProductID = await requestProductIDQueries.find()
         const returnRequests = () => new Promise((resolve, reject) => {
            const requestsIDBody = []
            if (requestsProductID.length !== 0) {
               requestsProductID.map(async (requestID, idx) => {
                  try {
                     const productID = await productIDQueries.findById(requestID.dataValues.ProductIDId)
                     const user = await userQueries.findById(requestID.dataValues.UserId)
                     const service = await serviceQueries.findById(productID.dataValues.ServiceId)
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
         const isTreated = await requestProductIDQueries.updateIsTreated(req.params.id)
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
         const service = await serviceQueries.findById(ServiceId)
         if (service === null) {
            return res.status(401).json(serviceNotExist(serviceName))
         }
         return res.status(200).json(service.ProductIDs)
      } catch (err) {
         return res.json(serverErrorMessage(err.message));
      }
   })()
}