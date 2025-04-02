import { Request, Response } from 'express';

export const googleCallback = (req: Request, res: Response) => {
    // console.log(req.user)
  res.json({ token: req.user });
};