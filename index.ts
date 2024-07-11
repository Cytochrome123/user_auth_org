
import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import Container, { Inject, Service } from 'typedi';
import Route_r from './src/Routes';

@Service()
class App {
    public app: express.Application;
    public env: string;
    public port: string | number;

    constructor(
        private readonly nrouter: Route_r,
    ) {
        this.app = express();
        this.env = process.env.NODE_ENV || 'development';
        this.port = process.env.PORT || 6000;

        this.initializeMiddlewares();
        this.initializeRoutes();

        // this.startTrack()
    }

    private initializeRoutes = () => {
        this.app.use(this.nrouter.path, this.nrouter.router);
    }

    private initializeMiddlewares() {
        this.app.get('/', (req: any, res: any) => res.json({ msg: 'HELLOOOO' }))

        this.app.use(morgan(process.env.LOG_FORMAT || 'dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    public getServer() {
        return this.app;
    }

    public listen() {
        return this.app.listen(this.port, async () => {
            console.info(`=================================`);
            console.info(`======= ENV: ${this.env} ========`);
            console.info(`🚀 App listening on the port ${this.port}`);
            console.info(`=================================`);
            this.env === 'development' && console.info(`👉👉 http://localhost:${this.port} 👈👈`)
        });
    }
}

export const instance = Container.get(App);
export const listeningInstance = instance.listen();

const app = instance.getServer();

export default app;
