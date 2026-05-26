"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const repositories_1 = require("../repositories");
const services_1 = require("../services");
const controllers_1 = require("../controllers");
const masterRouter = (0, express_1.Router)();
// Object Oriented Dependency Injection Linkage
const repo = new repositories_1.PaymentRepository();
const service = new services_1.PaymentService(repo);
const controller = new controllers_1.PaymentController(service);
// Endpoints mapping
masterRouter.post('/checkin', controller.processCheckIn);
masterRouter.post('/checkout', controller.processCheckOut);
exports.default = masterRouter;
