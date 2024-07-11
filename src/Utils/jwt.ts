import jwt from 'jsonwebtoken';

export const generateToken = (data: { email: string, id: string }): string => {
  return jwt.sign(data, process.env.JWT_SECRET!);
}

export const  encodeOTP = (code: string, email: string): string => {
  return jwt.sign({ code, email }, process.env.JWT_SECRET!, { expiresIn: "15m" })
}

export const decodeOTP = (token: string): { email: string, code: string } => {
  return jwt.decode(token) as { email: string, code: string };
}

export const decodeToken = (token: string): { email: string, id: string } => {
  return jwt.decode(token) as { email: string, id: string };
}

// export const generateAdminToken = (data: { email: string, id: number, role: Role }): string => {
//   return jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: '1d'});
// }