import { serverErrorMessage } from "../utils/messages";
import { userNotExist } from "../utils/messages/user";
import { loginRequest } from "./helper";

export const signIn = (app, passport) => (req, res) => {
    passport.authenticate('local', (error, user, info) => {
        if (error) {
            return res.json(serverErrorMessage());
        }
        if (!user) {
            return res.status(401).json(userNotExist(info));
        }

        loginRequest(user, req, res)

        return

    })(req, res)
}