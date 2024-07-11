"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_response_1 = require("../Utils/api_response");
const express_validator_1 = require("express-validator");
class Validator {
    constructor() {
        this.validate = (schema) => async (req, res, next) => {
            await Promise.all((0, express_validator_1.checkSchema)(schema).map(validation => validation.run(req)));
            const errors = (0, express_validator_1.validationResult)(req);
            if (errors.isEmpty()) {
                return next();
            }
            // const errs = errors.array();
            const errs = errors.array();
            const customErrArr = [];
            for (let err of errs) {
                customErrArr.push({
                    field: err.path,
                    message: err.msg
                });
            }
            return (0, api_response_1.validationError)(res, customErrArr, errs[0].msg, errs[0].path);
            // return validationError(res, errs)
        };
    }
}
exports.default = Validator;
