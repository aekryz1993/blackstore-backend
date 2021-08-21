import { createWallet, findWallet, updateAllWallets } from "../models/query/wallet";
import { serverErrorMessage } from "../utils/messages";

export const addWallet = (req, res, next) => {
	(async () => {
		try {
			let {dollar, euro, dinnar, associatedModelId, associatedModel} = req.body
			dollar = dollar ? dollar : 0.00
			euro = euro ? euro : 0.00
			dinnar = dinnar ? dinnar : 0.00
            await createWallet({dollar, euro, dinnar, [associatedModel]: associatedModelId})
            next()
		} catch (err) {
			return res.json(serverErrorMessage(err.message));
		}
	})()
}

export const updateCredit = (req, res) => {
	(async () => {
		try {
			let {dollar, euro, dinnar} = req.body
			dollar = dollar ? dollar : 0.00
			euro = euro ? euro : 0.00
			dinnar = dinnar ? dinnar : 0.00
			const UserId = req.params.userId
			const wallet = await findWallet(UserId)
			if (!wallet) {
				res.status(401).json({message: 'This wallet doesn\'t exist'})
			}
			dollar = wallet.dataValues.dollar + parseFloat(dollar)
			euro = wallet.dataValues.euro + parseFloat(euro)
			dinnar = wallet.dataValues.dinnar + parseFloat(dinnar)
            await updateAllWallets({UserId, dollar, euro, dinnar})
            return res.status(200).json({message: 'تم تحديث المحفظة بنجاح'})
		} catch (err) {
			return res.json(serverErrorMessage(err.message));
		}
	})()
}