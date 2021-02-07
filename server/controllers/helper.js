import { serverErrorMessage } from "../utils/messages";

export const loginRequest = (user, req, res) => {
    req.login(user, (error) => {
        if (error) {
            return res.json(serverErrorMessage());
        }

        if (req.isAuthenticated()) {
            return res.send('Welcome to your account')
        }
    })
}