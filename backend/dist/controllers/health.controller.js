"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealthStatus = void 0;
const config_1 = require("../config");
const getHealthStatus = (_request, response) => {
    response.status(200).json({
        message: "Hotel Booking Management API is running.",
        environment: config_1.config.nodeEnv,
        timestamp: new Date().toISOString(),
    });
};
exports.getHealthStatus = getHealthStatus;
