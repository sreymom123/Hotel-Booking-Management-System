"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const middlewares_1 = require("./middlewares");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: config_1.config.corsOrigin === "*" ? true : config_1.config.corsOrigin,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (_request, response) => {
    response.status(200).json({
        message: "Welcome to the Hotel Booking Management API.",
        healthCheck: "/api/health",
    });
});
app.use("/api", routes_1.default);
app.use(middlewares_1.notFoundHandler);
app.use(middlewares_1.errorHandler);
exports.default = app;
