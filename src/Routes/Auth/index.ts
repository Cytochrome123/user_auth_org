import { Router } from "express";
import AuthController from "../../Controllers/Auth";
import { Routes } from "../../Interfaces/router";
import { Inject, Service } from "typedi";
import AuthValidations from "../../Validations/Auth";


@Service()
class AuthRouter implements Routes {
  constructor (
    private readonly authController: AuthController,
    private readonly authValidation: AuthValidations,
  ) {
    this.path = "/auth";
    this.router = Router();

    this.initializeRoutes();
  }

  public path: string;
  public router: Router;

  private initializeRoutes () {
    this.router.post('/register', this.authValidation.signupValidator, this.authController.signup);
    this.router.post('/login', this.authValidation.loginValidator, this.authController.login);
    
  }
}

export default AuthRouter;
