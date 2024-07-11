import { Service } from "typedi";
import prisma, { BaseAdapter } from "..";
import { ETables } from "../../Types/db.types";

@Service()
class AuthAdapter extends BaseAdapter {
  constructor(
    private User = prisma.user,
    private Organization = prisma.organization
  ) {
    super()
  }

  public DBCreateUser = async (data: { email: string, firstName: string, lastName: string, password: string, phone: string }) => {
    try {
      const user = await this.User.create({
        data: {
          ...data
        },
        select: {
          userId: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true
        }
        // include: {
        //   createdOrgs: false,
        // },
      })

      // delete user.password;

      const organization = await this.Organization.create({
        data: {
          name: `${data.firstName}'s Organization`,
          description: '',
          createdBy: {
            connect: { userId: user.userId },
          },
          members: {
            connect: [{ userId: user.userId }],
          },
        },
      })

      return user;
    } catch (error) {
      return this.catchError(error);
    }
  }

  public DBGetUser = async (email: string) => {
    try {
      const user = await this.User.findUnique({
        where: {
          email
        },
        select: {
          userId: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true
        }
      })

      return user;
    } catch (error) {
      return this.catchError(error)
    }
  }

  public IsUserExists = async (id: string, email: string) => {
    try {
        const user = await this.User.findFirst({
          where: {
            userId: id,
            email
          }
        })

        return user;
    } catch (error) {
        return this.catchError(error)
    }
}

}

@Service()
export class AuthValidatorAdapter extends BaseAdapter {
  constructor(
    private User = prisma.user
  ) {
    super();
  }

  public DBCheckSignupEmail = async (email: string) => {
    try {
      const user = await this.User.findUnique({
        where: {
          email
        }
      })

      return user;
    } catch (error) {
      return this.catchError(error);
    }
  }

  public DBGetUserAndPassword = async (email: string) => {
    try {
      const user = await this.User.findUnique({
        where: {
          email
        }
      })

      return user;
    } catch (error) {
      return this.catchError(error);
    }
  }

}

export default AuthAdapter;