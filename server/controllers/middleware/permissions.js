import { findPermission } from "../../models/query/permission"
import { serverErrorMessage } from "../../utils/messages"
import { forbiddenActivePremission, forbiddenAdminPremission, forbiddenPremission } from "../../utils/messages/user"

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

export const checkPermission = (label) = (req, res, next) => {
    const userId = req.user.dataValues.id
    try {
        const permission = await findPermission(userId)
        if (!permission) res.status(403).json({message: 'permission doesn\'t exist'})
        if (!permission.dataValues[label]) res.status(403).json(forbiddenPremission())
        next()
    } catch (error) {
        return res.json(serverErrorMessage(err.message));
    }
}