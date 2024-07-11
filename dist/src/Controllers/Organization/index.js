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
const OrganizationAdapter_1 = __importDefault(require("../../Database/adapters/OrganizationAdapter"));
const api_response_1 = require("../../Utils/api_response");
const typedi_1 = require("typedi");
const __1 = __importDefault(require(".."));
let OrganizationController = class OrganizationController extends __1.default {
    constructor(organizationAdapter) {
        super();
        this.organizationAdapter = organizationAdapter;
        this.getOrganizations = async (req, res) => {
            const { auth_user } = req.body;
            try {
                const organizations = await this.organizationAdapter.DBGetOrganizations(auth_user.userId);
                return (0, api_response_1.success)(res, { organizations }, "Organizations");
            }
            catch (error) {
                return this.catchError(error, res);
            }
        };
        this.getOrganization = async (req, res) => {
            try {
                const { orgId } = req.params;
                const organization = await this.organizationAdapter.DBGetOrganization(orgId);
                return (0, api_response_1.success)(res, organization);
            }
            catch (error) {
                return this.catchError(error, res);
            }
        };
        this.createOrganization = async (req, res) => {
            try {
                const { auth_user, name, description } = req.body;
                console.log(auth_user);
                const organization = await this.organizationAdapter.DBCreateOrganization(auth_user.userId, { name, description });
                return (0, api_response_1.created)(res, organization);
            }
            catch (error) {
                return res.status(400).json({
                    "status": "Bad Request",
                    "message": "Client error",
                    "statusCode": 400
                });
            }
        };
        this.addUserToOrg = async (req, res) => {
            try {
                const { auth_user, userId } = req.body;
                const { orgId } = req.params;
                await this.organizationAdapter.DBAddUserToOrg(orgId, auth_user.userId, userId);
                return (0, api_response_1.successAction)(res, "User added to organisation successfully");
            }
            catch (error) {
                this.catchError(error, res);
            }
        };
    }
};
OrganizationController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [OrganizationAdapter_1.default])
], OrganizationController);
exports.default = OrganizationController;
