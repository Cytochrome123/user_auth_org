import request from 'supertest';
import app, { listeningInstance } from '../../index';
import { PrismaClient } from '@prisma/client';
// import { listeningInstance } from '../..';

const prisma = new PrismaClient();

describe('organization Endpoints', () => {
    let token: string;

    beforeAll(async () => {
        // Clear the database before running tests
        await prisma.organization.deleteMany({});
        await prisma.user.deleteMany({});

        // Register and login a user to get a token
        await request(app)
            .post('/api/auth/register')
            .send({
                firstName: 'Hudhayfah',
                lastName: 'Ismail',
                email: 'hismail@test.co',
                password: 'password123',
                phone: '1234567890',
            });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'hismail@test.co',
                password: 'password123',
            });

        token = res.body.data.accessToken;
    }, 10000);

    afterAll(async () => {
        await prisma.$disconnect();
        // app.listen().close();
        listeningInstance.close();
    }, 10000);

    it('should create an organization', async () => {
        const res = await request(app)
            .post('/api/organizations')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "Hudhayfah's New organization",
                description: 'A new organization',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.name).toBe("Hudhayfah's New organization");
    }, 10000);

    it('should fetch user organizations', async () => {
        const res = await request(app)
            .get('/api/organizations')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.organizations.length).toBe(2);
    }, 10000);

    it('should fetch a single organization by ID', async () => {
        const organizations = await prisma.organization.findMany({
            where: { members: { some: { email: 'hismail@test.co' } } },
        });

        const res = await request(app)
            .get(`/api/organizations/${organizations[0].orgId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.name).toBe("Hudhayfah's Organization");
    }, 10000);

    it('should not allow access to other members\' organizations', async () => {
        // Register another user
        await request(app)
            .post('/api/auth/register')
            .send({
                firstName: 'Test',
                lastName: 'Test',
                email: 'test@test.com',
                password: 'password123',
                phone: '0987654321',
            });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@test.com',
                password: 'password123',
            });

        const janeToken = res.body.data.accessToken;

        // Try to access Hudhayfah's organization
        const organizations = await prisma.organization.findMany({
            where: { members: { some: { email: 'hismail@test.co' } } },
        });

        const res2 = await request(app)
            .get(`/api/organizations/${organizations[0].orgId}`)
            .set('Authorization', `Bearer ${janeToken}`);

        expect(res2.status).toEqual(403);
    }, 10000);
});
