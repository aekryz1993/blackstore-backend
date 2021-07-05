import { createWallet, updateWallet } from "../models/query/wallet";
import { serverErrorMessage } from "../utils/messages";

export const addWallet = (req, res, next) => {
	(async () => {
		try {
			const {credit, associatedModelId, associatedModel} = req.body
            await createWallet({credit, [associatedModel]: associatedModelId})
            next()
		} catch (err) {
			return res.json(serverErrorMessage(err.message));
		}
	})()
}

export const updateCredit = (req, res) => {
	(async () => {
		try {
			const body = req.body
            await updateWallet(body)
            return res.status(200).json({message: 'تم تحديث المحفظة بنجاح'})
		} catch (err) {
			return res.json(serverErrorMessage(err.message));
		}
	})()
}