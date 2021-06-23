import { serverErrorMessage } from "../utils/messages";
import { userNotExist } from "../utils/messages/user";
import { loginRequest } from "./helper";

export const signIn = (passport) => (req, res) => {
    passport.authenticate('local', (error, user, info) => {
        if (error) {
            return res.json(serverErrorMessage(err.message));
        }
        if (!user) {
            return res.status(401).json(userNotExist(info));
        }
        
        loginRequest(user, req, res)

    })(req, res)
}

export const logout = (req, res) => {
    req.session == null
    req.user == null
    req.logout()
    res.json({message: 'You have been logged out', auth: false})
}