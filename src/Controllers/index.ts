import { Response } from "express";
import { serverError } from "../Utils/api_response";

class IndexController {
    public catchError = (error: any, res: Response) => {
        console.error(error);
        // return serverError(res, error.message)
        return serverError(res)
    }
}

export default IndexController;