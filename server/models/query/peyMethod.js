import models from "../associations";

export const createPayMethod = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [payMethod, created] = await models.PayMethod.findOrCreate({
          where: {
            name: body.name,
          },
          default: {body}
      });
      resolve({ payMethod, created });
    } catch (err) {
      reject(err);
    }
  });
};

export const findPayMethod = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payMethod = await models.PayMethod.findOne({
          where: {name: body.name}
      })
      resolve(payMethod);
    } catch (err) {
      reject(err);
    }
  });
};
