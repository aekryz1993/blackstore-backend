import path from "path";
import sharp from "sharp";
import fs from "fs";

import imageQueries from "../models/query/image";
import { serverErrorMessage } from "../utils/messages";
import { successRegistration } from "../utils/messages/service";
import { successRegistrationUser } from "../utils/messages/user";
import serviceQueries from "../models/query/service";

const CURRENT_WORKING_DIR = process.cwd();

export const addPicture = (req, res) => {
  (async () => {
    if (req.file == undefined) {
      const currentModel =
        req.baseUrl.split("/")[req.baseUrl.split("/").length - 1];
      const body = {
        type: "image/png",
        name: `default.png`,
        url: path.resolve(
          CURRENT_WORKING_DIR,
          `resource/static/assets/pictures/${currentModel}/default.png`
        ),
        [req.body.associatedModel]: req.body.associatedModelId,
      };
      await imageQueries.create(body);
      if (req.body.label) {
        return res.status(201).json(successRegistration(req.body.label));
      }
      return res.status(201).json(successRegistrationUser(req.body.username));
    }
    try {
      const thumbnailName = `thumbnail-${req.file.filename}`;
      const thumbnailtPath = path.resolve(req.file.destination, thumbnailName);

      const subThumbnailtPath = thumbnailtPath.substring(
        thumbnailtPath.indexOf("static")
      );

      const image = await sharp(req.file.path)
        .resize(100, 100)
        .toFile(thumbnailtPath);

      const body = {
        type: req.file.mimetype,
        name: thumbnailName,
        size: image.size,
        url: subThumbnailtPath,
        [req.body.associatedModel]: req.body.associatedModelId,
      };

      return fs.unlink(req.file.path, async (err) => {
        if (err) throw err;
        await imageQueries.create(body);
        if (req.body.label) {
          const service = await serviceQueries.findById(
            req.body.associatedModelId,
            req.body.category
          );
          return res.status(201).json(successRegistration(service.dataValues));
        }
        return res.status(201).json(successRegistrationUser(req.body.username));
      });
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};
