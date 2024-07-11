import { Service } from "typedi";
import { Router } from "express";
import AuthRouter from "./Auth";
import UserRouter from "./User";
import OrganizationRouter from "./Organization";

@Service()
class Route_r {
    public path: string;
    public router: Router;

    constructor(
        private authRouter: AuthRouter,
        private userRouter: UserRouter,
        private orgRouter: OrganizationRouter,
    ) {
        this.path = '/api';
        this.router = Router();

        this.initializeRoutes()
    }


    private initializeRoutes = () => {
        this.router.get('/test', (req, res) => res.status(200).json({ msg: 'Welcome to HNG stage 2 task'}));
        this.router.use(this.authRouter.path, this.authRouter.router);
        this.router.use(this.userRouter.path, this.userRouter.router);
        this.router.use(this.orgRouter.path, this.orgRouter.router);
    }
}

export default Route_r;