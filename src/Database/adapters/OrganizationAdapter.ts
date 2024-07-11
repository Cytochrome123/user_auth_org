import { Service } from "typedi";
import prisma, { BaseAdapter } from "..";

@Service()
class OrganizationAdapter extends BaseAdapter {
  constructor(
    private Organization = prisma.organization
  ) {
    super()
  }

  public DBGetOrganizations = async (userId: string) => {
    try {
      const organizations = await this.Organization.findMany({
        where: {
          createdById: userId
        },
        select: {
          orgId: true,
          name: true,
          description: true
        }
      });

      return organizations;
    } catch (error) {
      this.catchError(error)
    }
  }

  public DBGetOrganization = async (orgId: string) => {
    try {
      const organization = await this.Organization.findFirst({
        where: {
          orgId
        },
        select: {
          orgId: true,
          name: true,
          description: true
        }
      });

      return organization;
    } catch (error) {
      this.catchError(error)
    }
  }

  public DBCreateOrganization = async (userId: string, data: { name: string, description: string }) => {
    try {
      console.log(userId, 'userId');
      
      const organization = await this.Organization.create({
        data: {
          ...data,
          // createdById: userId
          createdBy: {
            connect: { userId }
          }
        },
        select: {
          orgId: true,
          name: true,
          description: true
        }
      });

      return organization;
    } catch (error) {
      this.catchError(error)
    }
  };

  public DBAddUserToOrg = async (orgId: string, creatorId: string, userId: string) => {
    try {
      await this.Organization.update({
        data: {
          members: {
            connect: [{ userId }]
          }
        },
        where: {
          orgId,
          createdById: creatorId
        },
      })
    } catch (error) {
      this.catchError(error)
    }
  }

}

@Service()
export class OrganizationValidatorAdapter extends BaseAdapter {
  constructor(
    private Organization = prisma.organization
  ) {
    super();
  }

  public DBCheckIfOrgMember = async (orgId: string, userId: string) => {
    try {
      const organization = await this.Organization.findFirst({
        where: {
          orgId,
          members: {
            some: {
              userId
            }
          }
        }
      });

      return !!organization
    } catch (error) {
      this.catchError(error)
    }
  }

  public DBGetOrgByName = async (name: string) => {
    try {
      const org = await this.Organization.findFirst({
        where: {
          name
        }
      });

      return !!org;
    } catch (error) {
      this.catchError(error)
    }
  }

  public DBGetOrgById = async (orgId: string) => {
    try {
      const org = await this.Organization.findUnique({
        where: {
          orgId
        }
      });

      return org;
    } catch (error) {
      this.catchError(error)
    }
  }

}

export default OrganizationAdapter;