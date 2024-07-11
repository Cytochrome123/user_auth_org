import { Service } from "typedi";
import prisma, { BaseAdapter } from "..";

@Service()
class UserAdapter extends BaseAdapter {
  constructor(
    private User = prisma.user
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
          password: false
        }
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
          password: false,
        }
      })

      return user;
    } catch (error) {
      return this.catchError(error)
    }
  }

  public DBGetUserById = async (id: string) => {
    try {
        const user = this.User.findUnique({
            where: {
                userId: id
            }
        });

        return user;
    } catch (error) {
        return this.catchError(error)
    }
  }

}

@Service()
export class UserValidatorAdapter extends BaseAdapter {
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

  public DBDoesUserExist = async (userId: string) => {
    try {
      const user = await this.User.findUnique({
        where: {
          userId
        }
      });

      return !!user;
    } catch (error) {
      return this.catchError(error)
    }
  }

}

export default UserAdapter;