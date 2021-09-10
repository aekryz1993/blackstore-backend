import priceQueries from "../../models/query/price";
import serviceQueries from "../../models/query/service";
import { serviceNotExist } from "../../utils/messages/service";

export const savePrices = (prices) => {
  return new Promise(async (resolve, reject) => {
    let notExist = [];
    try {
      for (let i in prices) {
        const serviceName = prices[i]["service"];
        const label = prices[i]["name"];
        const dinnar = prices[i]["dinnar"];
        const euro = prices[i]["euro"];
        const dollar = prices[i]["dollar"];
        const service = await serviceQueries.find(serviceName, "code");
        if (service === null) {
          throw serviceNotExist(serviceName);
        }
        const productCategory = service.ProductCategories.filter(
          (ProductCategorieItem) =>
            ProductCategorieItem.dataValues.label === label
        );
        const price = await priceQueries.findByProduct(
          productCategory[0].dataValues.id
        );

        if (productCategory.length !== 0) {
          await priceQueries.update(
            { dinnar, euro, dollar },
            price.dataValues.id
          );
        } else {
          notExist = [...notExist, label];
        }
      }
    } catch (error) {
      console.log(error);
      reject(error.message);
    }
    if (notExist.length !== 0) {
      resolve({
        message:
          "تم تحديث بعض الأسعار بنجاح لكن هذه الفئات لم تحدث أسعارها لأنها غير متوفرة",
        notExist,
      });
    } else {
      resolve({ message: "تم تحديث كل الأسعار بنجاح" });
    }
  });
};
