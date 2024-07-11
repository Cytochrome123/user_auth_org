"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationValidatorAdapter = void 0;
const typedi_1 = require("typedi");
const __1 = __importStar(require(".."));
let OrganizationAdapter = class OrganizationAdapter extends __1.BaseAdapter {
    constructor(Organization = __1.default.organization) {
        super();
        this.Organization = Organization;
        this.DBGetOrganizations = async (userId) => {
            try {
                const organizations = await this.Organization.findMany({
                    where: {
                        createdById: userId
                    },
                    select: {
                        orgId: true,
                        name: true,
                        description: true
                    }
                });
                return organizations;
            }
            catch (error) {
                this.catchError(error);
            }
        };
        this.DBGetOrganization = async (orgId) => {
            try {
                const organization = await this.Organization.findFirst({
                    where: {
                        orgId
                    },
                    select: {
                        orgId: true,
                        name: true,
                        description: true
                    }
                });
                return organization;
            }
            catch (error) {
                this.catchError(error);
            }
        };
        this.DBCreateOrganization = async (userId, data) => {
            try {
                console.log(userId, 'userId');
                const organization = await this.Organization.create({
                    data: Object.assign(Object.assign({}, data), { 
                        // createdById: userId
                        createdBy: {
                            connect: { userId }
                        } }),
                    select: {
                        orgId: true,
                        name: true,
                        description: true
                    }
                });
                return organization;
            }
            catch (error) {
                this.catchError(error);
            }
        };
        this.DBAddUserToOrg = async (orgId, creatorId, userId) => {
            try {
                await this.Organization.update({
                    data: {
                        members: {
                            connect: [{ userId }]
                        }
                    },
                    where: {
                        orgId,
                        createdById: creatorId
                    },
                });
            }
            catch (error) {
                this.catchError(error);
            }
        };
    }
};
OrganizationAdapter = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [Object])
], OrganizationAdapter);
let OrganizationValidatorAdapter = class OrganizationValidatorAdapter extends __1.BaseAdapter {
    constructor(Organization = __1.default.organization) {
        super();
        this.Organization = Organization;
        this.DBCheckIfOrgMember = async (orgId, userId) => {
            try {
                const organization = await this.Organization.findFirst({
                    where: {
                        orgId,
                        members: {
                            some: {
                                userId
                            }
                        }
                    }
                });
                return !!organization;
            }
            catch (error) {
                this.catchError(error);
            }
        };
        this.DBGetOrgByName = async (name) => {
            try {
                const org = await this.Organization.findFirst({
                    where: {
                        name
                    }
                });
                return !!org;
            }
            catch (error) {
                this.catchError(error);
            }
        };
        this.DBGetOrgById = async (orgId) => {
            try {
                const org = await this.Organization.findUnique({
                    where: {
                        orgId
                    }
                });
                return org;
            }
            catch (error) {
                this.catchError(error);
            }
        };
    }
};
exports.OrganizationValidatorAdapter = OrganizationValidatorAdapter;
exports.OrganizationValidatorAdapter = OrganizationValidatorAdapter = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [Object])
], OrganizationValidatorAdapter);
exports.default = OrganizationAdapter;
