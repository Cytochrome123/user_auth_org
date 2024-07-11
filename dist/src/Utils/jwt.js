"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.decodeOTP = exports.encodeOTP = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (data) => {
    return jsonwebtoken_1.default.sign(data, process.env.JWT_SECRET);
};
exports.generateToken = generateToken;
const encodeOTP = (code, email) => {
    return jsonwebtoken_1.default.sign({ code, email }, process.env.JWT_SECRET, { expiresIn: "15m" });
};
exports.encodeOTP = encodeOTP;
const decodeOTP = (token) => {
    return jsonwebtoken_1.default.decode(token);
};
exports.decodeOTP = decodeOTP;
const decodeToken = (token) => {
    return jsonwebtoken_1.default.decode(token);
};
exports.decodeToken = decodeToken;
// export const generateAdminToken = (data: { email: string, id: number, role: Role }): string => {
//   return jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: '1d'});
// }
