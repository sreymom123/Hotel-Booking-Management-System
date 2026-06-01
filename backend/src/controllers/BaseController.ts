import {Response} from "express";

export class BaseController {
    protected error(res: Response, status: number, message: string) {
        return res.status(status).json({
            success: false,
            message
        });
    }
    protected ok(res: Response,data: unknown, message: string) {
        return res.status(200).json({
            success: true,
            message,
            data
        });
    }
    protected created(res: Response, data: unknown, message = "created"){
        return res.status(201).json({
            success: true,
            message,
            data
        });
    }
    protected badrequest(res: Response, message = "Bad request"){
        return this.error(res, 400, message);
    }
    protected notfound(res: Response, message = "Not found") {
        return this.error(res, 404, message);
    }
    protected conflict(res: Response, message = "Conflict") {
        return this.error(res, 409, message);
    }
    protected serverError(res: Response, error: unknown){
        const message = error instanceof Error ? error.message: "Internal server error";

        return res.status(500).json({
            success: false,
            message,
        })
    }
}
