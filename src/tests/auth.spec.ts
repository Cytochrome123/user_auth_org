import request from 'supertest';
import app, { listeningInstance } from '../../server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth Endpoints', () => {
    beforeAll(async () => {

        await prisma.organization.deleteMany({});
        await prisma.user.deleteMany({});
    }, 10000);

    afterAll(async () => {
        await prisma.$disconnect();
        // app.listen().close();
        listeningInstance.close();
    }, 10000);

    it('should register user successfully with default organization', async () => {
        const res = await request(app)
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
        const res = await request(app)
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
        const res = await request(app)
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
        const res = await request(app)
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
        const res = await request(app)
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
        const res = await request(app)
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
        await request(app)
            .post('/api/auth/register')
            .send({
                firstName: 'Ammaar',
                lastName: 'Ismail',
                email: 'ammaar@test.co',
                password: 'password123',
                phone: '0987654321',
            });

        const res = await request(app)
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
