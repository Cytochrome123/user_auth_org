import { Service } from "typedi";
import Validator from "..";
import { AuthValidatorAdapter } from "../../Database/adapters/AuthAdapter";
import * as bcrypt from "bcryptjs";

@Service()
class AuthValidations extends Validator {
  constructor(
    private readonly authAdapter: AuthValidatorAdapter,
  ) {
    super()
  }

  public loginValidator = this.validate({
    email: {
      in: ["body"],
      isEmail: true,
      toLowerCase: true,
      errorMessage: "Email is required"
    },
    password: {
      in: ["body"],
      isString: true,
      isLength: { options: { min: 8 } },
      custom: {
        options: async (password, { req }) => {
          const user = await this.authAdapter.DBGetUserAndPassword(req.body.email);
          if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new Error("Invalid credentials!")
          }
        }
      },
      errorMessage: "Password is required"
    }
  })

  public signupValidator = this.validate({
    email: {
      in: ["body"],
      isEmail: true,
      toLowerCase: true,
      custom: {
        options: async (email) => {
          const user = await this.authAdapter.DBCheckSignupEmail(email);

          if (user) throw new Error("Email already in use!")
        }
      },
      errorMessage: "Email is required"
    },
    password: {
      in: ["body"],
      isString: true,
      errorMessage: "Password is required"
    },
    firstName: {
      in: ["body"],
      isString: true,
      notEmpty: true,
      errorMessage: "First Name is required"
    },
    lastName: {
      in: ["body"],
      isString: true,
      notEmpty: true,
      errorMessage: "Last Name is required"
    },
    phone: {
      in: ['body'],
      isString: true,
      optional: true,
      errorMessage: "Phone Number is required"
    }
  })


}

export default AuthValidations;
