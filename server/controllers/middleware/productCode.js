import { createProductCategory, findProductCategory } from "../../models/query/productCategory";
import { createProductCode } from "../../models/query/productCode";

export const saveCodes = (codes, service) => {
    return new Promise(async (resolve, reject) => {
        codes.forEach(async code => {
            try {
                const label = code["Product"]
                const serviceName = service.label
                const ServiceId = service.id
                const body = {label, serviceName: serviceName, ServiceId}
                let category = await findProductCategory(serviceName)
                if (!category) {
                    category = await createProductCategory(body)
                } else {
                    const productCategoryService = service.ProductCategories.filter(
                            ProductCategorieItem => ProductCategorieItem.dataValues.id === category.dataValues.id
                        )
                    if (!productCategoryService) {
                        category = await createProductCategory(body)
                    }
                }
                await createProductCode({
                    code: code['PIN/Code'],
                    Serial: code['Serial'],
                    Date: code['Date'],
                    isAvailable: true,
                    serviceName: serviceName,
                    ServiceId: ServiceId,
                    productCategoryName: category.productCategory.dataValues.label,
                    ProductCategoryId: category.productCategory.dataValues.id,
                })
            } catch (error) {
                reject(error.message)
            }
        });
        resolve({message: 'تم إضافة الأكواد بنجاح'})
    })
}