import { Op } from "sequelize";
import models from "../associations";

const create = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      await models.Price.create(body);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

const update = (body, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      await models.Price.update(body, {
        where: { [Op.or]: [{ ProductIDId: id }, { ProductCategoryId: id }] },
      });
      resolve({ message: "تم تحديث المنتج بنجاح" });
    } catch (err) {
      reject(err);
    }
  });
};

const findByProduct = (ProdId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const price = await models.Price.findOne({
        where: { ProductCategoryId: ProdId },
      });
      resolve(price);
    } catch (err) {
      reject(err);
    }
  });
};

export default {
  create,
  update,
  findByProduct,
};
