import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import jsonwebtoken from "jsonwebtoken";
import path from "path";
import fs from "fs";

import userQueries from "../models/query/user";

const pathToPublicKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToPublicKey, "utf8");

const pathToPrevKey = path.join(__dirname, "..", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToPrevKey, "utf8");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

const jwtStrategy = new JwtStrategy(options, async (jwt_payload, done) => {
  try {
    const user = await userQueries.findById(jwt_payload.sub);
    if (!user) {
      return done(null, false, {
        message: `غير مسجل ${userIdentifier}`,
      });
    }
    return done(null, user);
  } catch (error) {
    return done(err, false);
  }
});

const localStrategy = new LocalStrategy(
  async (userIdentifier, password, done) => {
    try {
      const user = await userQueries.find(userIdentifier);
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
      return done(err, false);
    }
  }
);

export const localPassportStrategy = (passport) =>
  passport.use("local", localStrategy);

export const jwtPassportStrategy = (passport) =>
  passport.use("jwt", jwtStrategy);

// export const ensureSocketAuthorized = (io) => {
//   io.use((socket, next) => {
//     if (socket.request.user) {
//       next();
//     } else {
//       next(new Error("unauthorized"));
//     }
//   });
// };

export function issueJWT(user) {
  const _id = user.id;

  const expiresIn = "1d";

  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}
