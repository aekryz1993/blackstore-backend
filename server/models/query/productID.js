import models from "../associations";

const create = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const productID = await models.ProductID.create(body);
      resolve({ productID });
    } catch (err) {
      reject(err);
    }
  });
};

const find = (label) => {
  return new Promise(async (resolve, reject) => {
    try {
      const productID = await models.ProductID.findOne({
        where: { label },
      });
      resolve(productID);
    } catch (err) {
      reject(err);
    }
  });
};

const findById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const productID = await models.ProductID.findByPk(id, {
        include: [models.Price],
      });
      resolve(productID);
    } catch (err) {
      reject(err);
    }
  });
};

export default {
  create,
  find,
  findById,
};
