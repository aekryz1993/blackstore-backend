import { Op } from "sequelize";

import models from "../associations";

const create = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const image = await models.Image.create(body);
      resolve(image);
    } catch (err) {
      reject(err);
    }
  });
};

const find = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const image = await models.Image.findOne({
        where: {
          [Op.or]: [{ UserId: id }, { ServiceId: id }],
        },
      });
      resolve(image);
    } catch (err) {
      reject(err);
    }
  });
};

export default {
  create,
  find,
};
