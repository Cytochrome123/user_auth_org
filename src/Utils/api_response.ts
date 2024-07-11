import { Service } from "typedi";
import { Response } from "express"

export function created<T>(res: Response, data: T, message = "Successful") {
  return res.status(201).json({
    status: "success",
    message,
    data,
  })
}

export function successAction(res: Response, message = "Successful") {
  return res.status(200).json({
    status: "success",
    message,
  })
}

export function serverError(res: Response, message = "Something went wrong") {
  return res.status(500).json({
    message,
    error: null,
    success: false,
  })
}

export function success<T> (res: Response, data: any, message = "Successful") {
  return res.status(200).json({
    status: 'success',
    message,
    data: data,
  })
} 

export function badRequest<T> (res: Response, errors: T, message = "Bad request") {
  return res.status(400).json({
    message,
    errors,
    success: false,
  })
}

export function validationError<T> (res: Response, errors: T, message = "Validation Error", path: string) {
  if(path == 'email') {
    return res.status(401).json({
      errors,
    })
  }
  return res.status(422).json({
    errors,
  })
}

export function unAuthorized<T>(res: Response, error: T, message = "Unauthorized request") {
  return res.status(403).json({
    message,
    error,
    success: false,
  })
}

export const asyncWrapper = async (func: Function) => {
  try {
    await func()
  } catch (error) {
    // logger.error(error)
    console.error(error)
    throw new Error("...")
  }
}