"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncWrapper = void 0;
exports.created = created;
exports.successAction = successAction;
exports.serverError = serverError;
exports.success = success;
exports.badRequest = badRequest;
exports.validationError = validationError;
exports.unAuthorized = unAuthorized;
function created(res, data, message = "Successful") {
    return res.status(201).json({
        status: "success",
        message,
        data,
    });
}
function successAction(res, message = "Successful") {
    return res.status(200).json({
        status: "success",
        message,
    });
}
function serverError(res, message = "Something went wrong") {
    return res.status(500).json({
        message,
        error: null,
        success: false,
    });
}
function success(res, data, message = "Successful") {
    return res.status(200).json({
        status: 'success',
        message,
        data: data,
    });
}
function badRequest(res, errors, message = "Bad request") {
    return res.status(400).json({
        message,
        errors,
        success: false,
    });
}
function validationError(res, errors, message = "Validation Error", path) {
    if (path == 'email') {
        return res.status(401).json({
            errors,
        });
    }
    return res.status(422).json({
        errors,
    });
}
function unAuthorized(res, error, message = "Unauthorized request") {
    return res.status(403).json({
        message,
        error,
        success: false,
    });
}
const asyncWrapper = async (func) => {
    try {
        await func();
    }
    catch (error) {
        // logger.error(error)
        console.error(error);
        throw new Error("...");
    }
};
exports.asyncWrapper = asyncWrapper;
