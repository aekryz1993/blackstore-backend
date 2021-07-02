import { createWallet, updateWallet } from "../models/query/wallet";

export const addWallet = (req, res, next) => {
	(async () => {
		try {
			const {credit, associatedModelId, associatedModel} = body
            await createWallet({credit, [associatedModelId]: associatedModel})
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