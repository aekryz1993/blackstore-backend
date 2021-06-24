import path from "path"
import sharp from "sharp"
import fs from "fs"

import { createPicture } from "../models/query/image";
import { serverErrorMessage } from "../utils/messages";
import { successRegistration } from '../utils/messages/service'
import { successRegistrationUser } from "../utils/messages/user";

export const addPicture = (req, res) => {
	(async () => {
		if (req.file == undefined) {
			return res.send(`You must select a file.`);
		}
		try {
			const thumbnailName = `thumbnail-${req.file.filename}`
			const thumbnailtPath = path.resolve(req.file.destination, thumbnailName)

			const image = await sharp(req.file.path)
				.resize(100, 100)
				.toFile(thumbnailtPath)
			console.log(req.file.path)

			const body = {
				type: req.file.mimetype,
				name: thumbnailName,
				size: image.size,
				url: thumbnailtPath,
				[req.body.associatedModel]: req.body.associatedModelId
			}

			return fs.unlink(req.file.path, async (err) => {
				if (err) throw err
				await createPicture(body)
				if (req.body.label) {
					return res.status(201).json(successRegistration(req.body.label))
				}
				return res.status(201).json(successRegistrationUser(req.body.username))
			})
			
		} catch (err) {
			return res.json(serverErrorMessage(err.message));
		}
	})()
}