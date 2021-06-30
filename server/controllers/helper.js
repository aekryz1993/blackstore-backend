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

export const paginateData = async (page, countItems) => {
    const limit = 6
    const offset = page ? limit * page : 0
    const totalUsers = await countItems()
    const totalPages = Math.ceil(totalUsers / limit);
    const nextPage = (totalPages === Number(page)+1) ? -1 : Number(page) + 1
    return {
        offset,
        limit,
        totalPages,
        totalUsers,
        nextPage,
    }
} 