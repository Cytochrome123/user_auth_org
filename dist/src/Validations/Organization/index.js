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
const __1 = __importDefault(require(".."));
const OrganizationAdapter_1 = require("../../Database/adapters/OrganizationAdapter");
let OrganizationValidations = class OrganizationValidations extends __1.default {
    constructor(organizationAdapter) {
        super();
        this.organizationAdapter = organizationAdapter;
        this.validateGetOrganization = this.validate({
            orgId: {
                in: ["params"],
                isString: true,
                // custom: {
                //     options: async (orgId, { req }) => {
                // const eligible = await this.organizationAdapter.DBCheckIfOrgMember(req.params?.orgId, req.body.auth_user.userId);
                // // if (!eligible) throw new Error("You're not eligible to view this organization");
                // if (!eligible) return unAuthorized(req, "You're not eliginle to view this organizations's data")
                //     }
                // },
            }
        });
        this.validateCreateOrganization = this.validate({
            name: {
                in: 'body',
                isString: true,
                errorMessage: "Organization's name is required",
                custom: {
                    options: async (name) => {
                        const exists = await this.organizationAdapter.DBGetOrgByName(name);
                        if (exists)
                            throw new Error('An organization with the name provided already exists');
                    }
                }
            },
            description: {
                in: 'body',
                isString: true,
                optional: true
            }
        });
        this.validateAddUserToOrg = this.validate({
            orgId: {
                in: 'params',
                isString: true,
                custom: {
                    options: async (orgId, { req }) => {
                        const exists = await this.organizationAdapter.DBGetOrgById(orgId);
                        if (!exists)
                            throw new Error('Invalid Organization');
                        if (exists.createdById !== req.body.auth_user.userId)
                            throw new Error("You don't have the permission to add to this organization");
                    }
                }
            },
            userId: {
                in: 'body',
                isString: true,
                custom: {
                    options: async (userId, { req }) => {
                        var _a;
                        const alreadyAMember = await this.organizationAdapter.DBCheckIfOrgMember((_a = req.params) === null || _a === void 0 ? void 0 : _a.orgId, userId);
                        if (alreadyAMember)
                            throw new Error('User is a already a member of the organization');
                    }
                }
            }
        });
    }
};
OrganizationValidations = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [OrganizationAdapter_1.OrganizationValidatorAdapter])
], OrganizationValidations);
exports.default = OrganizationValidations;
