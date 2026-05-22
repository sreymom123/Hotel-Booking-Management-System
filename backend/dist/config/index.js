"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const parsePort = (value, fallback) => {
    const parsedValue = Number(value);
    return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
};
exports.config = {
    port: parsePort(process.env.PORT, 5000),
    nodeEnv: process.env.NODE_ENV ?? "development",
    corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
};
