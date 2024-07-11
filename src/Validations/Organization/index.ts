import { Service } from "typedi";
import Validator from "..";
import { OrganizationValidatorAdapter } from "../../Database/adapters/OrganizationAdapter";
import * as bcrypt from "bcryptjs";
import { unAuthorized } from "../../Utils/api_response";

@Service()
class OrganizationValidations extends Validator {
    constructor(
        private readonly organizationAdapter: OrganizationValidatorAdapter,
    ) {
        super()
    }

    public validateGetOrganization = this.validate({
        orgId: {
            in: ["params"],
            isString: true,
            // custom: {
            //     options: async (orgId, { req }) => {
                    // const eligible = await this.organizationAdapter.DBCheckIfOrgMember(req.params?.orgId, req.body.auth_user.userId);

                    // // if (!eligible) throw new Error("You're not eligible to view this organization");
                    // if (!eligible) return unAuthorized(req, "You're not eliginle to view this organizations's data")
            //     }
            // },
        }
    })

    public validateCreateOrganization = this.validate({
        name: {
            in: 'body',
            isString: true,
            errorMessage: "Organization's name is required",
            custom: {
                options: async name => {
                    const exists = await this.organizationAdapter.DBGetOrgByName(name);

                    if(exists) throw new Error('An organization with the name provided already exists')
                }
            }
        },
        description: {
            in: 'body',
            isString: true,
            optional: true
        }
    });

    public validateAddUserToOrg = this.validate({
        orgId: {
            in: 'params',
            isString: true,
            custom: {
                options: async (orgId, { req }) => {
                    const exists = await this.organizationAdapter.DBGetOrgById(orgId);

                    if(!exists) throw new Error('Invalid Organization');

                    if(exists.createdById !== req.body.auth_user.userId) throw new Error("You don't have the permission to add to this organization")
                }
            }
        },
        userId: {
            in: 'body',
            isString: true,
            custom: {
                options: async (userId, { req }) => {
                    const alreadyAMember = await this.organizationAdapter.DBCheckIfOrgMember(req.params?.orgId, userId);

                    if(alreadyAMember) throw new Error('User is a already a member of the organization');
                }
            }
        }
    })
}

export default OrganizationValidations;
