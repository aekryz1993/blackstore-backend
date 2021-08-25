import { findImage } from "../models/query/image";
import { serverErrorMessage } from "../utils/messages";

export const loginRequest = (user, req, res) => {
  req.login(user, async (error) => {
    if (error) {
      return res.json(serverErrorMessage(err.message));
    }
    if (req.isAuthenticated()) {
      const isActive = user.dataValues.isActive;
      const isAdmin = user.dataValues.isAdmin;
      const currentUser = Object.fromEntries(
        Object.entries(user.dataValues).filter(
          ([key, _]) =>
            key !== "password" && key !== "createdAt" && key !== "updatedAt"
        )
      );
      const userImage = await findImage(currentUser.id);

      const profilePic = userImage.dataValues.url
        .split("/")
        .slice(
          userImage.dataValues.url
            .split("/")
            .findIndex((ele) => ele === "resources") + 1
        )
        .join("/");

      return res.json({
        message: "Welcome to your account",
        currentUser,
        profilePic,
        auth: true,
      });
    }
  });
};

export const paginateData = async (page, countItems) => {
  const limit = 6;
  const offset = page ? limit * page : 0;
  const totalUsers = await countItems();
  const totalPages = Math.ceil(totalUsers / limit);
  const nextPage = totalPages === Number(page) + 1 ? -1 : Number(page) + 1;
  return {
    offset,
    limit,
    totalPages,
    totalUsers,
    nextPage,
  };
};
