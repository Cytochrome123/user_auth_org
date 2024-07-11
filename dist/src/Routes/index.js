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
const typedi_1 = require("typedi");
const express_1 = require("express");
const Auth_1 = __importDefault(require("./Auth"));
const User_1 = __importDefault(require("./User"));
const Organization_1 = __importDefault(require("./Organization"));
let Route_r = class Route_r {
    constructor(authRouter, userRouter, orgRouter) {
        this.authRouter = authRouter;
        this.userRouter = userRouter;
        this.orgRouter = orgRouter;
        this.initializeRoutes = () => {
            this.router.get('/test', (req, res) => res.status(200).json({ msg: 'Welcome to HNG stage 2 task' }));
            this.router.use(this.authRouter.path, this.authRouter.router);
            this.router.use(this.userRouter.path, this.userRouter.router);
            this.router.use(this.orgRouter.path, this.orgRouter.router);
        };
        this.path = '/api';
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
};
Route_r = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [Auth_1.default,
        User_1.default,
        Organization_1.default])
], Route_r);
exports.default = Route_r;
