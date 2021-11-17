import { serverErrorMessage } from "../utils/messages";
import { userNotExist } from "../utils/messages/user";
import { loginRequest } from "./helper";
import imageQueries from "../models/query/image";

export const signIn = (passport) => (req, res) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return res.status(500).json(serverErrorMessage(error.message));
    }
    if (!user) {
      return res.status(401).json(userNotExist(info));
    }

    loginRequest(user, req, res);
  })(req, res);
};

export const logout = (req, res) => {
  req.session == null;
  req.user == null;
  req.logout();
  res.json({ message: "You have been logged out", auth: false });
};

export const checkSession = (req, res) => {
  (async () => {
    try {
      const { token } = req.body;
      const user = req.user
      if (token === req.headers.cookie) {
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

        return res.status(200).json({
          message: "Welcome Again!",
          currentUser,
          profilePic,
          auth: true,
        });
      } else {
      	return res.status(400).json({ auth: false });
       }
    } catch (error) {
      return res.status(401).json(serverErrorMessage(error));
    }
  })();
};
