import productCategoryQueries from "../models/query/productCategory";
import serviceQueries from "../models/query/service";
import priceQueries from "../models/query/price";
import { serverErrorMessage } from "../utils/messages";
import { serviceNotExist, successRegistration } from '../utils/messages/service'
import { productCategoryAlreadyExistMsg } from '../utils/messages/productCategory'
import { savePrices } from "./middleware/productCategory";

export const addProductCategory = (req, res) => {
   (async () => {
      const {label, serviceName, dollar, euro, dinnar} = req.body
      try {
         const service = await serviceQueries.findByNameAndCategory(serviceName, 'code')
         if (service === null) {
            return res.status(401).json(serviceNotExist(serviceName))
         }
         
         const checkExistCategory = service.dataValues.ProductCategories.filter(ProductCategorieItem => ProductCategorieItem.dataValues.label === label)
         if (checkExistCategory.length !== 0) {
            return res.status(409).json(productCategoryAlreadyExistMsg(label))
         }
         const { productCategory } = await productCategoryQueries.create({label, ServiceId: service.dataValues.id})
			const bodyPrice = {
				dollar,
				euro,
				dinnar,
				ProductCategoryId: productCategory.dataValues.id
			}
         await priceQueries.create(bodyPrice);

         const product = await productCategoryQueries.findById(productCategory.dataValues.id);

         return res.status(201).json(successRegistration(product.dataValues))
      } catch (err) {
         return res.json(serverErrorMessage(err.message));
      }
   })()
}

export const updatePriceProductCategory = (req, res) => {
   (async () => {
      const {dollar, euro, dinnar} = req.body

      try {
         const product = await productCategoryQueries.findById(req.params.id)
         if (product === null) {
            return res.status(401).json(serviceNotExist('this category doesn\'t exist'))
         }
         const price = product.Price.dataValues

         const message = await priceQueries.update({
            dollar,
            euro,
            dinnar,
         }, price.id)
         return res.status(200).json({message})
      } catch (err) {
         return res.json(serverErrorMessage(err.message));
      }
   })()
}

export const updateMultiPricesProductCategory = (req, res) => {
   (async () => {
      const prices = req.dataObj
      try {
         const message = await savePrices(prices)
         return res.status(200).json(message)
      } catch (err) {
         return res.json(serverErrorMessage(err.message));
      }
   })()
}

export const fetchProductCategoriessByService = (req, res) => {
   (async () => {
      const {ServiceId, serviceName} = req.query
      try {
         const service = await serviceQueries.findById(ServiceId)
         if (service === null) {
            return res.status(401).json(serviceNotExist(serviceName))
         }
         return res.status(200).json(service.ProductCategories)
      } catch (err) {
         return res.json(serverErrorMessage(err.message));
      }
   })()
}