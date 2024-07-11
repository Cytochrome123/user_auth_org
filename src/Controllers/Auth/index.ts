import UserAdapter from "../../Database/adapters/AuthAdapter";
import { created, success, successAction } from "../../Utils/api_response";
import { Request, Response } from "express";
import { Service } from "typedi";
import * as bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';
import { encodeOTP, generateToken } from "../../Utils/jwt";
import IndexController from "..";


@Service()
class AuthController extends IndexController {
  constructor(
    private readonly userAdapter: UserAdapter,
  ) {
    super()
  }

  public signup = async (req: Request, res: Response) => {
    try {
      const { email, firstName, lastName, password: raw, phone } = req.body;

      const salt = await bcrypt.genSalt(10);
      const password = bcrypt.hashSync(raw, salt);

      const user = await this.userAdapter.DBCreateUser({
        email, firstName, lastName, password, phone
      });

      const token = generateToken({ email, id: user.userId });

      return created(res, { accessToken: token, user }, "Registration successful");
    } catch (error) {
      console.log(error);
      
      return res.status(400).json(
        {
          "status": "Bad request",
          "message": "Registration unsuccessful",
          "statusCode": 400
        }
      )
    }
  }

  public login = async (req: Request, res: Response) => {
    const { email } = req.body

    try {
      const user = await this.userAdapter.DBGetUser(email) as any

      const token = generateToken({ email, id: user.userId });

      return success(res, { accessToken: token, user }, "Login successful");
    } catch (error) {
      return res.status(400).json({
        "status": "Bad request",
        "message": "Authentication failed",
        "statusCode": 401
    })
    }
  }
}

export default AuthController;