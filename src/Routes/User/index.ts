import { Router } from "express";
import UserController from "../../Controllers/User";
import { Routes } from "../../Interfaces/router";
import { Inject, Service } from "typedi";
import UserValidations from "../../Validations/User";
import { AuthMiddleware } from "../../Middleware";


@Service()
class UserRouter implements Routes {
  constructor (
    private readonly userController: UserController,
    private readonly userValidation: UserValidations,
    private readonly authMiddleware: AuthMiddleware
  ) {
    this.path = "/users";
    this.router = Router();

    this.initializeRoutes();
  }

  public path: string;
  public router: Router;

  private initializeRoutes () {
    this.router.get('/:userId', this.authMiddleware.isAuthticated, this.userValidation.validateGetUserRecord, this.userController.getUserRecord);
    
  }
}

export default UserRouter;
