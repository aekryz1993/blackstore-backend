import { issueJWT } from "../config/passport.config";
import { serverErrorMessage } from "../utils/messages";

export const loginRequest = (user, req, res) => {
  req.login(user, { session: false }, async (error) => {
    try {
      if (error) {
        return res.status(500).json(serverErrorMessage(error.message));
      }
      if (req.isAuthenticated()) {
        const fullname = await user.getFullname();
        user.dataValues.fullname = fullname;

        const currentUser = Object.fromEntries(
          Object.entries(user.dataValues).filter(
            ([key, _]) =>
              key !== "password" && key !== "createdAt" && key !== "updatedAt"
          )
        );

        const tokenObject = issueJWT(currentUser);

        return res.status(200).json({
          user: currentUser,
          token: tokenObject.token,
          expires: tokenObject.expires,
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
  // const afterLastPage = scorable ? -1 : 0;
  if (totalItems !== 0) {
    const offset = page ? limit * page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    const nextPage = (Number(page) + 1) % totalPages;
    // totalPages === Number(page) + 1 ? afterLastPage : Number(page) + 1;
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
