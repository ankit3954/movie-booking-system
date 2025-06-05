import { Request, Response } from 'express';
import { sendResponse } from '../utils/responseHandler';

export const googleCallback = (req: Request, res: Response) => {
    const token = req.user

    //sending token to frontend via URL
    res.redirect(`http://localhost:3000/auth/success?token=${token}`)
    // sendResponse(res, 200, req.user, 'User is registered')
  // res.json({ token: req.user });
};