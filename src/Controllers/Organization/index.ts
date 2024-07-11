import OrganizationAdapter from "../../Database/adapters/OrganizationAdapter";
import { created, success, successAction } from "../../Utils/api_response";
import { Request, Response } from "express";
import { Service } from "typedi";

import IndexController from "..";


@Service()
class OrganizationController extends IndexController {
  constructor(
    private readonly organizationAdapter: OrganizationAdapter,
  ) {
    super()
  }

  public getOrganizations = async (req: Request, res: Response) => {
    const { auth_user } = req.body;

    try {
      const organizations = await this.organizationAdapter.DBGetOrganizations(auth_user.userId)

      return success(res, { organizations }, "Organizations");
    } catch (error) {
      return this.catchError(error, res);
    }
  }

  public getOrganization = async (req: Request, res: Response) => {
    try {
      const { orgId } = req.params;

      const organization = await this.organizationAdapter.DBGetOrganization(orgId);

      return success(res, organization);
    } catch (error) {
      return this.catchError(error, res);
    }
  }

  public createOrganization = async (req: Request, res: Response) => {
    try {
      const { auth_user, name, description } = req.body;
      console.log(auth_user);
      

      const organization = await this.organizationAdapter.DBCreateOrganization(auth_user.userId, { name, description });

      return created(res, organization);
    } catch (error) {
      return res.status(400).json({
        "status": "Bad Request",
        "message": "Client error",
        "statusCode": 400
      })
    }
  };

  public addUserToOrg = async (req: Request, res: Response) => {
    try {
      const { auth_user, userId } = req.body;
      const { orgId } = req.params;

      await this.organizationAdapter.DBAddUserToOrg(orgId, auth_user.userId, userId);

      return successAction(res, "User added to organisation successfully");
    } catch (error) {
      this.catchError(error, res);
    }
  }
}

export default OrganizationController;