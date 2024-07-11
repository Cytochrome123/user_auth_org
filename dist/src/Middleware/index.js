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
exports.AuthMiddleware = void 0;
const api_response_1 = require("../Utils/api_response");
const typedi_1 = require("typedi");
const AuthAdapter_1 = __importDefault(require("../Database/adapters/AuthAdapter"));
const jwt_1 = require("../Utils/jwt");
const OrganizationAdapter_1 = require("../Database/adapters/OrganizationAdapter");
let AuthMiddleware = class AuthMiddleware {
    constructor(authAdapter, orgAdapter) {
        this.authAdapter = authAdapter;
        this.orgAdapter = orgAdapter;
        this.isAuthticated = async (req, res, next) => {
            const { authorization } = req.headers;
            if (!authorization || !authorization.startsWith("Bearer")) {
                return (0, api_response_1.unAuthorized)(res, "Invalid token");
            }
            try {
                const token = authorization.split(" ")[1];
                const { id, email } = (0, jwt_1.decodeToken)(token);
                const user = await this.authAdapter.IsUserExists(id, email);
                if (!user) {
                    return (0, api_response_1.unAuthorized)(res, "Invalid token");
                }
                req.body = Object.assign(Object.assign({}, req.body), { auth_user: Object.assign({}, user) });
                return next();
            }
            catch (error) {
                return (0, api_response_1.unAuthorized)(res, "Invalid token");
            }
        };
        this.isMember = async (req, res, next) => {
            var _a;
            try {
                const eligible = await this.orgAdapter.DBCheckIfOrgMember((_a = req.params) === null || _a === void 0 ? void 0 : _a.orgId, req.body.auth_user.userId);
                if (!eligible)
                    return (0, api_response_1.unAuthorized)(res, "You're not eliginle to view this organizations's data");
                return next();
            }
            catch (error) {
                return (0, api_response_1.unAuthorized)(res, "Not authorized for this organization");
            }
        };
    }
};
exports.AuthMiddleware = AuthMiddleware;
exports.AuthMiddleware = AuthMiddleware = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [AuthAdapter_1.default,
        OrganizationAdapter_1.OrganizationValidatorAdapter])
], AuthMiddleware);
