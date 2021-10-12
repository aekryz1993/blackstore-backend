import permissionQueries from "../models/query/permission";
import { serverErrorMessage } from "../utils/messages";
import { successUpdatedPermission } from "../utils/messages/permission";

export const updatePermission = () => (req, res) => {
    (async () => {
      const body = req.body
      try {
        await permissionQueries.update({body, UserId: req.params.userId});
  
        return res.status(201).json(successUpdatedPermission(body.username));
      } catch (err) {
        return res.json(serverErrorMessage(err.message));
      }
    })();
  };