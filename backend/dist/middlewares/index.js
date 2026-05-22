"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const notFoundHandler = (request, response) => {
    response.status(404).json({
        message: `Route ${request.method} ${request.originalUrl} not found.`,
    });
};
exports.notFoundHandler = notFoundHandler;
const errorHandler = (error, _request, response, _next) => {
    console.error(error);
    response.status(500).json({
        message: "An unexpected error occurred.",
    });
};
exports.errorHandler = errorHandler;
