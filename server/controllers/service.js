import fs from "fs";

import imageQueries from "../models/query/image";
import serviceQueries from "../models/query/service";
import { serverErrorMessage } from "../utils/messages";
import { fieldAlreadyExist, serviceNotExist } from "../utils/messages/service";

export const addService = (req, res, next) => {
  (async () => {
    const body = req.body;
    try {
      const { service, isNewService } = await serviceQueries.create(body);
      const { label } = service.dataValues;
      if (!isNewService) {
        return res.status(409).json(fieldAlreadyExist(label));
      }
      req.body.associatedModelId = service.dataValues.id;
      req.body.associatedModel = "ServiceId";
      return next();
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

export const updateService = (req, res, next) => {
  (async () => {
    const body = req.body;
    const { id } = req.params;
    try {
      const service = await serviceQueries.update({ id, body });

      const image = await imageQueries.find(id);

      if (image) {
        const currentImageUrl = image.dataValues.url;
        await image.destroy();
        if (!currentImageUrl.endsWith("default.png")) {
          fs.unlink(currentImageUrl, (err) => {
            if (err) throw err;
          });
        }

        req.body.associatedModelId = id;
        req.body.associatedModel = "ServiceId";
        req.body.label = service.dataValues.label;

        next();
      }
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

export const fetchServices = (req, res) => {
  (async () => {
    try {
      const services = await serviceQueries.findByCategory(req.params.category);
      return res.json({ services });
    } catch (err) {
      console.error(err);
      return res.json(serverErrorMessage(err.message));
    }
  })();
};

export const updateServicePicture = (req, res, next) => {
  (async () => {
    try {
      const { id, label } = req.body;
      const image = await imageQueries.find(id);
      if (image) {
        const currentImageUrl = image.dataValues.url;
        await image.destroy();
        if (!currentImageUrl.endsWith("default.png")) {
          fs.unlink(currentImageUrl, (err) => {
            if (err) throw err;
          });
        }
        req.body.associatedModelId = id;
        req.body.associatedModel = "ServiceId";
        req.body.label = label;

        next();
      } else {
        throw "error";
      }
    } catch (err) {
      return res.json(serverErrorMessage(err.message));
    }
  })();
};
