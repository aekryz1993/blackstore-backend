import fs from "fs";
import path from "path"

import { createPicture } from "../models/query/image";
import { serverErrorMessage } from "../utils/messages";
import { successRegistration } from '../utils/messages/service'

const CURRENT_WORKING_DIR = process.cwd();
const imageDist = path.resolve(CURRENT_WORKING_DIR, 'resources/static/assets/pictures');

export const addPicture = (req, res) => {
	(async () => {
		if (req.file == undefined) {
			return res.send(`You must select a file.`);
		}

		const body = {
			type: req.file.mimetype,
			name: req.file.originalname,
			size: req.file.size,
			url: imageDist + '/' + req.file.filename,
			[req.body.associatedModel]: req.body.associatedModelId
		}
		console.log(body)
		try {
			await createPicture(body)

			return res.status(201).json(successRegistration(req.body.label))

		} catch (err) {
			console.log(err)
			return res.json(serverErrorMessage());
		}
	})()
}