import jwt from 'jsonwebtoken';
import {findOAuthUser, createOAuthUser} from '../models/oauth.model';
import {createUser} from '../models/user.model';
import {executeQuery} from '../config/db';
// import { User } from '../models/User';

interface User {
  user_id: string
    // id: number;
    // username: string;
    // email: string;
    // password?: string;
    // oauth_provider?: string;
    // oauth_id?: string;
  }
  

const secretKey = process.env.JWT_SECRET as string;

export const authenticateOAuthUser = async (
  provider: string,
  providerUserId: string,
  displayName: string,
  email: string
): Promise<string> => {
  try {
    const existingOAuthUsers = await findOAuthUser(provider, providerUserId);
    if (existingOAuthUsers.length > 0) {
      const user: User = existingOAuthUsers[0];
      const token = jwt.sign({ id: user.user_id, username: displayName }, secretKey, { expiresIn: '1h' });
      return token;
    }

    const newOAuthUser = await createUser(displayName, email, null);
    const extractedUserId = await executeQuery("SELECT id FROM users where email  = ?", [email])
    // console.log("Result ------>", extractedUserId)
    await createOAuthUser(extractedUserId[0].id, provider, providerUserId);

    const token = jwt.sign({ id: extractedUserId[0].id, username: displayName }, secretKey, { expiresIn: '1h' });
    return token;
  } catch (error) {
    throw new Error(error as string);
  }
};

module.exports = { authenticateOAuthUser };
