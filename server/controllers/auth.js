import { serverErrorMessage } from "../utils/messages";
import { invalidToken, userNotExist } from "../utils/messages/user";
import { loginRequest } from "./helper";

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
  req.user == null;
  req.logout();
  res.status(200).json({ message: "You have been successfully logged out" });
};

export const checkSession = (req, res) => {
  (async () => {
    try {
      const currentUser = Object.fromEntries(
        Object.entries(req.user.dataValues).filter(
          ([key, _]) =>
            key !== "password" && key !== "createdAt" && key !== "updatedAt"
        )
      );

      return res.status(200).json({
        user: currentUser,
      });
    } catch (error) {
      return res.status(500).json(serverErrorMessage(error.message));
    }
  })();
};
