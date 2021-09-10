import models from "../associations";

const create = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const productCode = await models.ProductCode.create(body);
      resolve({ productCode });
    } catch (err) {
      reject(err);
    }
  });
};

const find = (code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const productCode = await models.ProductCode.findOne({
        where: { code },
      });
      resolve(productCode);
    } catch (err) {
      reject(err);
    }
  });
};

const findAll = (quantity, categoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const productCodes = await models.ProductCode.findAll({
        where: {
          ProductCategoryId: categoryId,
          sold: false,
        },
        limit: quantity,
      });
      resolve(productCodes);
    } catch (err) {
      reject(err);
    }
  });
};

const update = (id, currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await models.ProductCode.update(
        { sold: true, UserId: currentUserId },
        {
          where: {
            id,
          },
        }
      );
      resolve("updated");
    } catch (err) {
      reject(err);
    }
  });
};

const findSoldByUser = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const productCodes = await models.ProductCode.findAll({
        where: {
          sold: true,
          UserId: currentUserId,
        },
      });
      resolve(productCodes);
    } catch (err) {
      reject(err);
    }
  });
};

export default {
  create,
  find,
  findAll,
  update,
  findSoldByUser,
};
