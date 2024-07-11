import { Router } from "express";
import OrganizationController from "../../Controllers/Organization";
import { Routes } from "../../Interfaces/router";
import { Inject, Service } from "typedi";
import OrganizationValidations from "../../Validations/Organization";
import { AuthMiddleware } from "../../Middleware";


@Service()
class OrganizationRouter implements Routes {
  constructor (
    private readonly organizationController: OrganizationController,
    private readonly organizationValidation: OrganizationValidations,
    private readonly authMiddleware: AuthMiddleware
  ) {
    this.path = "/organizations";
    this.router = Router();

    this.initializeRoutes();
  }

  public path: string;
  public router: Router;

  private initializeRoutes () {
    this.router.get('/', this.authMiddleware.isAuthticated, this.organizationController.getOrganizations);
    this.router.get('/:orgId', this.authMiddleware.isAuthticated, this.authMiddleware.isMember, this.organizationValidation.validateGetOrganization, this.organizationController.getOrganization);
    this.router.post('/', this.authMiddleware.isAuthticated, this.organizationValidation.validateCreateOrganization, this.organizationController.createOrganization);
    this.router.post('/:orgId/users', this.authMiddleware.isAuthticated, this.organizationValidation.validateAddUserToOrg, this.organizationController.addUserToOrg)

  }
}

export default OrganizationRouter;
