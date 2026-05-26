"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static success(res, message, data, status = 200) {
        res.status(status).json({
            success: true,
            message,
            data: data ?? null,
        });
    }
    static error(res, message, status = 400) {
        res.status(status).json({
            success: false,
            message,
        });
    }
}
exports.ApiResponse = ApiResponse;
