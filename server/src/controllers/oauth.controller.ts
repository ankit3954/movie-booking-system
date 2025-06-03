import { Request, Response } from 'express';
import { sendResponse } from '../utils/responseHandler';

export const googleCallback = (req: Request, res: Response) => {
    // console.log(req.user)
    sendResponse(res, 200, req.user, 'User is registered')
  // res.json({ token: req.user });
};