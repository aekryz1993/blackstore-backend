// import path from "path";

// import imageQueries from "../models/query/image";
import permissionQuaries from "../models/query/permission";
import userQueries from "../models/query/user";

// const STORAGE_DIR =
//   process.env.NODE_ENV === "development" ? process.cwd() : "/var/lib";

export const createAdmin = (redisClient) => {
  (async () => {
    try {
      const { user, isNewUser } = await userQueries.create(initUser);
      const UserId = user.dataValues.id;
      if (isNewUser) {
        await redisClient.set(UserId, "0");
        // const metadata = {
        //   type: "image/png",
        //   name: `default.png`,
        //   url: path.resolve(
        //     STORAGE_DIR,
        //     `resource/static/assets/pictures/users/default.png`
        //   ),
        //   UserId,
        // };
        await permissionQuaries.create({ ...permission, UserId });
        // await imageQueries.create(metadata);
        console.log("owner has been successfully created.");
        return;
      }
      console.log("owner already exist.");
    } catch (err) {
      console.log(err.message);
    }
  })();
};

const initUser = {
  firstname: "firstname",
  lastname: "lastname",
  username: "admin",
  email: "admin@hotmail.com",
  password: "Admin-31",
  phone: "0655544444",
  isAdmin: true,
};

const permission = {
  addProduct: true,
  updateProductPrice: true,
  updateProduct: true,
  addUser: true,
  viewUser: true,
  updateUser: true,
  updateCredit: true,
  addPayMethod: true,
  viewcmnd: true,
  confirmPayment: true,
  updatePermissions: true,
};
