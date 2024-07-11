"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../../Controllers/User"));
const typedi_1 = require("typedi");
const User_2 = __importDefault(require("../../Validations/User"));
const Middleware_1 = require("../../Middleware");
let UserRouter = class UserRouter {
    constructor(userController, userValidation, authMiddleware) {
        this.userController = userController;
        this.userValidation = userValidation;
        this.authMiddleware = authMiddleware;
        this.path = "/users";
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/:userId', this.authMiddleware.isAuthticated, this.userValidation.validateGetUserRecord, this.userController.getUserRecord);
    }
};
UserRouter = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [User_1.default,
        User_2.default,
        Middleware_1.AuthMiddleware])
], UserRouter);
exports.default = UserRouter;
