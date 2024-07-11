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
exports.UserValidatorAdapter = void 0;
const typedi_1 = require("typedi");
const __1 = __importStar(require(".."));
let UserAdapter = class UserAdapter extends __1.BaseAdapter {
    constructor(User = __1.default.user) {
        super();
        this.User = User;
        this.DBCreateUser = async (data) => {
            try {
                const user = await this.User.create({
                    data: Object.assign({}, data),
                    select: {
                        password: false
                    }
                });
                return user;
            }
            catch (error) {
                return this.catchError(error);
            }
        };
        this.DBGetUser = async (email) => {
            try {
                const user = await this.User.findUnique({
                    where: {
                        email
                    },
                    select: {
                        password: false,
                    }
                });
                return user;
            }
            catch (error) {
                return this.catchError(error);
            }
        };
        this.DBGetUserById = async (id) => {
            try {
                const user = this.User.findUnique({
                    where: {
                        userId: id
                    }
                });
                return user;
            }
            catch (error) {
                return this.catchError(error);
            }
        };
    }
};
UserAdapter = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [Object])
], UserAdapter);
let UserValidatorAdapter = class UserValidatorAdapter extends __1.BaseAdapter {
    constructor(User = __1.default.user) {
        super();
        this.User = User;
        this.DBCheckSignupEmail = async (email) => {
            try {
                const user = await this.User.findUnique({
                    where: {
                        email
                    }
                });
                return user;
            }
            catch (error) {
                return this.catchError(error);
            }
        };
        this.DBGetUserAndPassword = async (email) => {
            try {
                const user = await this.User.findUnique({
                    where: {
                        email
                    }
                });
                return user;
            }
            catch (error) {
                return this.catchError(error);
            }
        };
        this.DBDoesUserExist = async (userId) => {
            try {
                const user = await this.User.findUnique({
                    where: {
                        userId
                    }
                });
                return !!user;
            }
            catch (error) {
                return this.catchError(error);
            }
        };
    }
};
exports.UserValidatorAdapter = UserValidatorAdapter;
exports.UserValidatorAdapter = UserValidatorAdapter = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [Object])
], UserValidatorAdapter);
exports.default = UserAdapter;
