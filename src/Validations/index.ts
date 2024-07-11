import { badRequest, validationError,  } from '../Utils/api_response';
import { NextFunction, Request, Response } from 'express';
import { Schema, checkSchema, validationResult } from 'express-validator';

class Validator {
  public validate = (schema: Schema) => async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(checkSchema(schema).map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // const errs = errors.array();
    const errs: any[] = errors.array();

    const customErrArr = []
    for(let err of errs) {
      customErrArr.push({
        field: err.path,
        message: err.msg
      })
    }

    return validationError(res, customErrArr, errs[0].msg, errs[0].path)
    // return validationError(res, errs)
  };
}

export default Validator;