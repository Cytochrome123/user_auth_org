import { Service } from "typedi";
import Validator from "..";
import { UserValidatorAdapter } from "../../Database/adapters/UserAdapter";
import * as bcrypt from "bcryptjs";

@Service()
class UserValidations extends Validator {
  constructor(
    private readonly userAdapter: UserValidatorAdapter,
  ) {
    super()
  }

  public validateGetUserRecord = this.validate({
    userId: {
      in: ["params"],
      isString: true,
      custom: {
        options: async userId => {
          const exists = await this.userAdapter.DBDoesUserExist(userId);

          if(!exists) throw new Error("Invalid user")
        }
      },
    }
  })


}

export default UserValidations;
