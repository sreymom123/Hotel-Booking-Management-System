"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const response_1 = require("../utils/response");
class PaymentController {
    service;
    constructor(service) {
        this.service = service;
    }
    processCheckIn = async (req, res) => {
        try {
            const { bookingId, adminId, paymentMethod, note } = req.body;
            if (!bookingId || !adminId || !paymentMethod) {
                response_1.ApiResponse.error(res, "Validation parameters failed: bookingId, adminId, and paymentMethod are required.");
                return;
            }
            const log = await this.service.checkIn(Number(bookingId), Number(adminId), paymentMethod, note);
            response_1.ApiResponse.success(res, "Check-in processed successfully; Room state is now OCCUPIED.", log, 201);
        }
        catch (error) {
            response_1.ApiResponse.error(res, error.message || "An unexpected error occurred during check-in.");
        }
    };
    processCheckOut = async (req, res) => {
        try {
            const { bookingId, adminId, note } = req.body;
            if (!bookingId || !adminId) {
                response_1.ApiResponse.error(res, "Validation parameters failed: bookingId and adminId are required.");
                return;
            }
            const log = await this.service.checkOut(Number(bookingId), Number(adminId), note);
            response_1.ApiResponse.success(res, "Check-out processed successfully; Room state is now AVAILABLE.", log);
        }
        catch (error) {
            response_1.ApiResponse.error(res, error.message || "An unexpected error occurred during check-out.");
        }
    };
}
exports.PaymentController = PaymentController;
