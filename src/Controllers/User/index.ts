import UserAdapter from "../../Database/adapters/UserAdapter";
import { created, success, successAction } from "../../Utils/api_response";
import { Request, Response } from "express";
import { Service } from "typedi";
import * as bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';
import { encodeOTP, generateToken } from "../../Utils/jwt";
import IndexController from "..";


@Service()
class UserController extends IndexController {
  constructor(
    private readonly userAdapter: UserAdapter,
  ) {
    super()
  }

  public getUserRecord = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const user = await this.userAdapter.DBGetUserById(userId)

      return success(res, user, "User record");
    } catch (error) {
      return this.catchError(error, res);
    }
  }
}

export default UserController;