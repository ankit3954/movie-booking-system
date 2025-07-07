import { NextFunction, Request, Response } from "express";

require("dotenv").config()
const jwt = require("jsonwebtoken");

const { sendResponse } = require("../utils/responseHandler");

type tokenData = {
    email: string
}

interface CustomRequest extends Request {
    data?: tokenData; // Add the custom `data` property
  }

export async function generateToken(id: string, username: string) {
    const data = {id, username}
    const accessToken = jwt.sign(data, process.env.JWT_SECRET);
    return accessToken;   
}   

function authorizeToken(req: CustomRequest, res: Response, next: NextFunction){
    const token = req.headers['authorization'];
    jwt.verify(token, process.env.JWT_SECRET, (err: any, data: tokenData) => {
        if(err){
            sendResponse(res, 403, err, "Something went wrong")
        }
        req.data = data;
        next();
    })

}

module.exports = {generateToken, authorizeToken};