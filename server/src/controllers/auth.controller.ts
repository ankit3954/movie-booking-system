import executeQuery from "../config/db";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/responseHandler";
import {generateToken} from "../utils/auth"

const bcrypt = require("bcrypt");

const _insertUser = () => `INSERT INTO users 
                            (username, email, password)
                            VALUES
                            (?, ?, ?)    
                        `;

const _extractPassword = () => `SELECT password FROM users 
                                WHERE email = ?`;



const verifyPassword = async(password: string, storedPasssword: string) => {
    const isPasswordCorrect = await bcrypt.compare(password, storedPasssword)
    return isPasswordCorrect
}


export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, email } = req.body;

    const encryptedPassword = await bcrypt.hash(password, 10);
    const result = await executeQuery(_insertUser(), [
      username,
      email,
      encryptedPassword,
    ]);

    sendResponse(true, res, 200, result, 'User is registered')

  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log(req.body)
    const { password, email } = req.body;

    const result = await executeQuery(_extractPassword(), [email]);
    
    // console.log(result)
    if(result.length === 0){
        sendResponse(false, res, 200, result, "User not found")
        return
    }

    const storedPasssword = result[0].password;
    const isPasswordCorrect = await verifyPassword(password, storedPasssword)

    if(isPasswordCorrect){
        const token = await generateToken(email);
        sendResponse(true, res, 200, token, "User Logged In Successfully")
    }

  } catch (error) {
    next(error)
  }
};


module.exports = {registerController, loginController}