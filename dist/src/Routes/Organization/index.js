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
const Organization_1 = __importDefault(require("../../Controllers/Organization"));
const typedi_1 = require("typedi");
const Organization_2 = __importDefault(require("../../Validations/Organization"));
const Middleware_1 = require("../../Middleware");
let OrganizationRouter = class OrganizationRouter {
    constructor(organizationController, organizationValidation, authMiddleware) {
        this.organizationController = organizationController;
        this.organizationValidation = organizationValidation;
        this.authMiddleware = authMiddleware;
        this.path = "/organizations";
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/', this.authMiddleware.isAuthticated, this.organizationController.getOrganizations);
        this.router.get('/:orgId', this.authMiddleware.isAuthticated, this.authMiddleware.isMember, this.organizationValidation.validateGetOrganization, this.organizationController.getOrganization);
        this.router.post('/', this.authMiddleware.isAuthticated, this.organizationValidation.validateCreateOrganization, this.organizationController.createOrganization);
        this.router.post('/:orgId/users', this.authMiddleware.isAuthticated, this.organizationValidation.validateAddUserToOrg, this.organizationController.addUserToOrg);
    }
};
OrganizationRouter = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [Organization_1.default,
        Organization_2.default,
        Middleware_1.AuthMiddleware])
], OrganizationRouter);
exports.default = OrganizationRouter;
