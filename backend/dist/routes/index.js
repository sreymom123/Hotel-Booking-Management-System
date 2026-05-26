"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_routes_1 = __importDefault(require("./health.routes"));
const paymentRoutes_1 = __importDefault(require("./paymentRoutes"));
const router = (0, express_1.Router)();
router.get("/", (_request, response) => {
    response.status(200).json({
        message: "Hotel Booking Management API routes are available.",
    });
});
router.use("/health", health_routes_1.default);
router.use("/payment", paymentRoutes_1.default);
exports.default = router;
