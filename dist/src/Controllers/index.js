"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_response_1 = require("../Utils/api_response");
class IndexController {
    constructor() {
        this.catchError = (error, res) => {
            console.error(error);
            // return serverError(res, error.message)
            return (0, api_response_1.serverError)(res);
        };
    }
}
exports.default = IndexController;
