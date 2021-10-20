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

export const updateProductCategory = (req, res) => {
   (async () => {
      const {dollar, euro, dinnar, label} = req.body
      const {id} = req.params;

      try {
         await productCategoryQueries.update({field: 'id', value: id, body: {label}})

         const message = await priceQueries.update({
            dollar,
            euro,
            dinnar,
         }, id)

         const product = await productCategoryQueries.findById(id);

         return res.status(200).json({message, product, success: true})
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