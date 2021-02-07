import { forbiddenActivePremission, forbiddenAdminPremission } from "../../utils/messages/user"

export const checkAdminPermission = (req, res, next) => {
    const _isAdmin = req.user.dataValues.isAdmin
    
    if (!_isAdmin) res.status(403).json(forbiddenAdminPremission())
    next() 
}

export const checkActivePermission = (req, res, next) => {
    const _isActive = req.user.dataValues.isActive
    
    if (!_isActive) res.status(403).json(forbiddenActivePremission())
    next() 
}