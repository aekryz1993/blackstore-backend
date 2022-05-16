import path from "path";
import imageQueries from "../../models/query/image";
import permissionQueries from "../../models/query/permission";

import userQueries from "../../models/query/user";
import walletQueries from "../../models/query/wallet";

const CURRENT_WORKING_DIR = process.cwd();

export const saveUsers = (users, redisClient) => {
  return new Promise(async (resolve, reject) => {
    let exist = [];
    let notExist = false;
    try {
      for (let i in users) {
        const firstname = users[i]["nom"];
        const lastname = users[i]["prénom"];
        const username = users[i]["username"];
        const password = users[i]["mot de passe"];
        const email = users[i]["email"];
        const phone = String(users[i]["phone"]);
        const credit = users[i]["credit"];

        const { user, isNewUser } = await userQueries.create({
          firstname,
          lastname,
          username,
          password,
          email,
          phone,
        });
        if (!isNewUser) {
          exist = [...exist, username];
        } else {
          notExist = true;
          const UserId = user.dataValues.id;
          await redisClient.set(UserId, "0");
          await permissionQueries.create({ UserId });
          await walletQueries.create({ credit, UserId });
          const imageBody = {
            type: "image/png",
            name: `default.png`,
            url: path.resolve(
              CURRENT_WORKING_DIR,
              `resource/static/assets/pictures/users/default.png`
            ),
            UserId,
          };
          await imageQueries.create(imageBody);
        }
      }
    } catch (error) {
      console.log(error);
      reject(error.message);
    }
    if (!notExist) {
      reject({ message: "جميع العملاء تم إضافتهم مسبقا" });
    }
    if (exist.length !== 0) {
      resolve({
        message: "تم إضافة بعض العملاء بنجاح",
        exist,
      });
    } else {
      resolve({ message: "تم إضافة كل العملاء بنجاح" });
    }
  });
};
