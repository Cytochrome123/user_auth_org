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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthAdapter_1 = __importDefault(require("../../Database/adapters/AuthAdapter"));
const api_response_1 = require("../../Utils/api_response");
const typedi_1 = require("typedi");
const bcrypt = __importStar(require("bcryptjs"));
const jwt_1 = require("../../Utils/jwt");
const __1 = __importDefault(require(".."));
let AuthController = class AuthController extends __1.default {
    constructor(userAdapter) {
        super();
        this.userAdapter = userAdapter;
        this.signup = async (req, res) => {
            try {
                const { email, firstName, lastName, password: raw, phone } = req.body;
                const salt = await bcrypt.genSalt(10);
                const password = bcrypt.hashSync(raw, salt);
                const user = await this.userAdapter.DBCreateUser({
                    email, firstName, lastName, password, phone
                });
                const token = (0, jwt_1.generateToken)({ email, id: user.userId });
                return (0, api_response_1.created)(res, { accessToken: token, user }, "Registration successful");
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({
                    "status": "Bad request",
                    "message": "Registration unsuccessful",
                    "statusCode": 400
                });
            }
        };
        this.login = async (req, res) => {
            const { email } = req.body;
            try {
                const user = await this.userAdapter.DBGetUser(email);
                const token = (0, jwt_1.generateToken)({ email, id: user.userId });
                return (0, api_response_1.success)(res, { accessToken: token, user }, "Login successful");
            }
            catch (error) {
                return res.status(400).json({
                    "status": "Bad request",
                    "message": "Authentication failed",
                    "statusCode": 401
                });
            }
        };
    }
};
AuthController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [AuthAdapter_1.default])
], AuthController);
exports.default = AuthController;
