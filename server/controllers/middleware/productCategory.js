import { updatePrice } from "../../models/query/productCategory"
import { findServiceById } from "../../models/query/service"
import { serviceNotExist } from "../../utils/messages/service"

export const savePrices = (prices, ServiceId, serviceName) => {
    return new Promise(async (resolve, reject) => {
        let notExist = []
        try {
            for (let i in prices) {
                const priceCoin = prices[i]["price_coin"]
                const pricePoint = prices[i]["price_point"]
                const label = prices[i]["name"]
                const service = await findServiceById(ServiceId)
                if (service === null) {
                   return res.status(401).json(serviceNotExist(serviceName))
                }
                const productCategory = service.ProductCategories.filter(
                    ProductCategorieItem => ProductCategorieItem.dataValues.label === label
                )
                if (productCategory.length !== 0) {
                    console.log(service.ProductCategories[0].dataValues.label == label)
                    await updatePrice({id: productCategory[0].dataValues.id, priceCoin, pricePoint})
                } else {
                    notExist = [...notExist, label]
                }
            }
        } catch (error) {
            console.log(error)
            reject(error.message)
        }
        if (notExist.length !== 0) {
            resolve({
                message: 'تم تحديث بعض الأسعار بنجاح لكن هذه الفئات لم تحدث أسعارها لأنها غير متوفرة',
                notExist
            })
        } else {
            resolve({message: 'تم تحديث بعض الأسعار بنجاح'})
        }
    }) 
}