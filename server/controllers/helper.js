import imageQueries from "../models/query/image";
import { serverErrorMessage } from "../utils/messages";

export const loginRequest = (user, req, res) => {
  req.login(user, async (error) => {
    try {
      if (error) {
        return res.status(500).json(serverErrorMessage(error.message));
      }
      if (req.isAuthenticated()) {
        const currentUser = Object.fromEntries(
          Object.entries(user.dataValues).filter(
            ([key, _]) =>
              key !== "password" && key !== "createdAt" && key !== "updatedAt"
          )
        );
        const userImage = await imageQueries.find(currentUser.id);

        const profilePic = userImage.dataValues.url
          ? userImage.dataValues.url
              .split("/")
              .slice(
                userImage.dataValues.url
                  .split("/")
                  .findIndex((ele) => ele === "resources") + 1
              )
              .join("/")
          : null;

        return res.json({
          message: "Welcome to your account",
          currentUser,
          profilePic,
          auth: true,
        });
      }
    } catch (error) {
      return res.status(500).json(serverErrorMessage(error.message));
    }
  });
};

export const paginateData = async (
  page,
  countItems,
  limit,
  scorable,
  extraData
) => {
  const totalItems = await countItems(extraData);
  const afterLastPage = scorable ? -1 : 0;
  if (totalItems !== 0) {
    const offset = page ? limit * page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    const nextPage =
      totalPages === Number(page) + 1 ? afterLastPage : Number(page) + 1;
    return {
      offset,
      limit,
      totalPages,
      totalItems,
      nextPage,
    };
  }
  return {
    offset: 0,
    limit: 0,
    totalPages: 0,
    totalItems,
    nextPage: 0,
  };
};
