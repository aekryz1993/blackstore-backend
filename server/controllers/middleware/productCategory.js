import { updatePrice } from "../../models/query/productCategory"

export const savePrices = (prices, service) => {
    return Promise((resolve, reject) => {
        const notExist = []
        prices.forEach((async price => {
            try {
                const priceCoin = price["price_coin"]
                const pricePoint = price["price_point"]
                const label = price["name"]
                const productCategory = service.ProductCategories.filter(
                    ProductCategorieItem => ProductCategorieItem.dataValues.label === label
                )
                if (productCategory) {
                    await updatePrice({id: productCategory.dataValues.id, priceCoin, pricePoint})
                } else {
                    [...notExist, label]
                }
            } catch (error) {
                reject(error.message)
            }
        }))
        if (notExist) {
            resolve({
                message: 'تم تحديث بعض الأسعار بنجاح لكن هذه الفئات لم تحدث أسعارها لأنها غير متوفرة',
                notExist
            })
        }
        resolve({message: 'تم تحديث بعض الأسعار بنجاح'})
    })
}