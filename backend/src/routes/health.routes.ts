import { Router } from "express";

import { getHealthStatus } from "../controllers";

const healthRouter = Router();

healthRouter.get("/", getHealthStatus);

export default healthRouter;
