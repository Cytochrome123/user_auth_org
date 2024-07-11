import { unAuthorized } from "../Utils/api_response";
import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";
import AuthAdapter from "../Database/adapters/AuthAdapter";
import { decodeToken } from '../Utils/jwt';
import { OrganizationValidatorAdapter } from "../Database/adapters/OrganizationAdapter";

@Service()
export class AuthMiddleware {
    constructor(
        private readonly authAdapter: AuthAdapter,
        private readonly orgAdapter: OrganizationValidatorAdapter
    ) { }

    public isAuthticated = async (req: Request, res: Response, next: NextFunction) => {
        const { authorization } = req.headers;

        if (!authorization || !authorization.startsWith("Bearer")) {
            return unAuthorized(res, "Invalid token");
        }


        try {
            const token = authorization.split(" ")[1];

            const { id, email } = decodeToken(token);

            const user = await this.authAdapter.IsUserExists(id, email);

            if (!user) {
                return unAuthorized(res, "Invalid token");
            }

            req.body = {
                ...req.body,
                auth_user: {
                    ...user
                }
            }

            return next();
        } catch (error) {
            return unAuthorized(res, "Invalid token");
        }
    }

    public isMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const eligible = await this.orgAdapter.DBCheckIfOrgMember(req.params?.orgId, req.body.auth_user.userId);

            if (!eligible) return unAuthorized(res, "You're not eliginle to view this organizations's data");

            return next();
        } catch (error) {
            return unAuthorized(res, "Not authorized for this organization")
        }
    }
}
