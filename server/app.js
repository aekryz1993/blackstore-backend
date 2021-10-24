import express from "express";
import logger from "morgan";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import path from "path";

import { SESSION_SECRET, SESSION_SECRET_VALUE } from "./config/passport.config";

const app = express();
const CURRENT_WORKING_DIR = process.cwd();

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
  app.use(compression());
}

app.use(helmet());
app.use(cors({origin: '*'}));
app.use(express.json());
app.use(
  express.urlencoded({ extended: false,
  })
);
app.use(express.static(path.join(CURRENT_WORKING_DIR, "certificate")));
app.use(express.static(path.join(CURRENT_WORKING_DIR, "resources")));
app.set(SESSION_SECRET, SESSION_SECRET_VALUE);

app.get("/", function (req, res) {
   console.log(`Server running on ${process.env.PORT} port, PID: ${process.pid}`);
   res.send('Welcome to Black Store GB.')
});

export default app;
