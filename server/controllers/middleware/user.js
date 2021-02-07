import { forbiddenAdminPremission } from "../../utils/messages/user"

export const checkAdminPermission = (req, res, next) => {
    const _isAdmin = req.user.dataValues.isAdmin
    
    if (!_isAdmin) res.status(403).json(forbiddenAdminPremission())
    next() 
}