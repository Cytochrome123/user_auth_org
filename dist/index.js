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
exports.listeningInstance = exports.instance = void 0;
require("dotenv/config");
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const typedi_1 = __importStar(require("typedi"));
const Routes_1 = __importDefault(require("./src/Routes"));
let App = class App {
    constructor(nrouter) {
        this.nrouter = nrouter;
        this.initializeRoutes = () => {
            this.app.use(this.nrouter.path, this.nrouter.router);
        };
        this.app = (0, express_1.default)();
        this.env = process.env.NODE_ENV || 'development';
        this.port = process.env.PORT || 6000;
        this.initializeMiddlewares();
        this.initializeRoutes();
        // this.startTrack()
    }
    initializeMiddlewares() {
        this.app.get('/', (req, res) => res.json({ msg: 'HELLOOOO' }));
        this.app.use((0, morgan_1.default)(process.env.LOG_FORMAT || 'dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    getServer() {
        return this.app;
    }
    listen() {
        return this.app.listen(this.port, async () => {
            console.info(`=================================`);
            console.info(`======= ENV: ${this.env} ========`);
            console.info(`🚀 App listening on the port ${this.port}`);
            console.info(`=================================`);
            this.env === 'development' && console.info(`👉👉 http://localhost:${this.port} 👈👈`);
        });
    }
};
App = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [Routes_1.default])
], App);
exports.instance = typedi_1.default.get(App);
exports.listeningInstance = exports.instance.listen();
const app = exports.instance.getServer();
exports.default = app;
