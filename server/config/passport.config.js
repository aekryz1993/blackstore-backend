import { Strategy as LocalStrategy } from "passport-local";

import userQueries from "../models/query/user";

const localStrategy = new LocalStrategy(
  async (userIdentifier, password, done) => {
    try {
      const user = await userQueries.findUser(userIdentifier);
      if (!user) {
        return done(null, false, {
          message: `غير مسجل ${userIdentifier}`,
        });
      }
      const match = await user.checkPassword(password);

      if (!match) {
        return done(null, false, {
          message: "كلمة السر خاطئة",
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res
    .status(401)
    .json({ message: "user does not authenticated", auth: false });
}

export const localPassportStrategy = (passport) => {
  passport.serializeUser((user, done) => done(null, user.dataValues.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userQueries.findUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  passport.use("local", localStrategy);
  passport.authenticationMiddleware = ensureAuthenticated;
};

export const ensureSocketAuthorized = (io) => {
  io.use((socket, next) => {
    if (socket.request.user) {
      next();
    } else {
      next(new Error("unauthorized"));
    }
  });
};

export const SESSION_SECRET = process.env.SESSION_SECRET || "SECRET_KEY_AUTH";
export const SESSION_SECRET_VALUE =
  process.env.SESSION_SECRET_VALUE || "mxkfHC28Ghnxm554DD";
export const expirySessionDate = new Date(Date.now() + 60 * 60 * 1000);
