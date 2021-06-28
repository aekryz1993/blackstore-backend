import { serverErrorMessage } from "../utils/messages";

export const loginRequest = (user, req, res) => {
    req.login(user, (error) => {
        if (error) {
            return res.json(serverErrorMessage(err.message));
        }

        if (req.isAuthenticated()) {
            const isActive = user.dataValues.isActive
            const isAdmin = user.dataValues.isAdmin
            return res.json({message: 'Welcome to your account', auth: true, isActive, isAdmin})
        }
    })
}

