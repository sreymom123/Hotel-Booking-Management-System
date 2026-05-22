"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const healthRouter = (0, express_1.Router)();
healthRouter.get("/", controllers_1.getHealthStatus);
exports.default = healthRouter;
