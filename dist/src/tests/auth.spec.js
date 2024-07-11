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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importStar(require("../../index"));
const client_1 = require("@prisma/client");
// import { listeningInstance } from '../..';
const prisma = new client_1.PrismaClient();
describe('Auth Endpoints', () => {
    beforeAll(async () => {
        await prisma.organization.deleteMany({});
        await prisma.user.deleteMany({});
    }, 10000);
    afterAll(async () => {
        await prisma.$disconnect();
        // app.listen().close();
        index_1.listeningInstance.close();
    }, 10000);
    it('should register user successfully with default organization', async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/register')
            .send({
            firstName: 'Hudhayfah',
            lastName: 'Ismail',
            email: 'hismail@test.co',
            password: 'password123',
            phone: '1234567890',
        });
        expect(res.status).toEqual(201);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.data.user.firstName).toBe('Hudhayfah');
        expect(res.body.data.user.lastName).toBe('Ismail');
        expect(res.body.data.user.email).toBe('hismail@test.co');
        expect(res.body.data.user.phone).toBe('1234567890');
        const organizations = await prisma.organization.findMany({
            where: { members: { some: { email: 'hismail@test.co' } } },
        });
        expect(organizations.length).toBe(1);
        expect(organizations[0].name).toBe("Hudhayfah's Organization");
    }, 10000);
    it('should log the user in successfully', async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/login')
            .send({
            email: 'hismail@test.co',
            password: 'password123',
        });
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.data.user.email).toBe('hismail@test.co');
    }, 10000);
    it('should fail if firstName is missing', async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/register')
            .send({
            lastName: 'Ismail',
            email: 'test@test.com',
            password: 'password123',
            phone: '1234567890',
        });
        expect(res.status).toEqual(422);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors[0].field).toBe('firstName');
    }, 10000);
    it('should fail if lastName is missing', async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/register')
            .send({
            firstName: 'Hudhayfah',
            email: 'test@test.com',
            password: 'password123',
            phone: '1234567890',
        });
        expect(res.status).toEqual(422);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors[0].field).toBe('lastName');
    }, 10000);
    it('should fail if email is missing', async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/register')
            .send({
            firstName: 'Hudhayfah',
            lastName: 'Ismail',
            password: 'password123',
            phone: '1234567890',
        });
        expect(res.status).toEqual(422);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors[0].field).toBe('email');
    }, 10000);
    it('should fail if password is missing', async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/register')
            .send({
            firstName: 'Hudhayfah',
            lastName: 'Ismail',
            email: 'test@test.com',
            phone: '1234567890',
        });
        expect(res.status).toEqual(422);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors[0].field).toBe('password');
    }, 10000);
    it(`should fail if there's duplicate email`, async () => {
        await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/register')
            .send({
            firstName: 'Ammaar',
            lastName: 'Ismail',
            email: 'ammaar@test.co',
            password: 'password123',
            phone: '0987654321',
        });
        const res = await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/register')
            .send({
            firstName: 'Ammaar',
            lastName: 'Ismail',
            email: 'ammaar@test.co',
            password: 'password123',
            phone: '0987654321',
        });
        expect(res.status).toEqual(422);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors[0].field).toBe('email');
    }, 10000);
});
