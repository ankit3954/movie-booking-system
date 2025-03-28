import jwt from 'jsonwebtoken';
import {findOAuthUser, createOAuthUser} from '../models/oauth.model';
import {createUser} from '../models/user.model';
// import { User } from '../models/User';

export interface User {
    id: number;
    username: string;
    email: string;
    password?: string;
    oauth_provider?: string;
    oauth_id?: string;
  }
  

const secretKey = process.env.JWT_SECRET as string;

export const authenticateOAuthUser = async (
  provider: string,
  providerUserId: string,
  displayName: string,
  email: string
): Promise<{ token: string }> => {
  try {
    const results = await findOAuthUser(provider, providerUserId);
    if (results.length > 0) {
      const user: User = results[0];
      const token = jwt.sign({ id: user.id, username: displayName }, secretKey, { expiresIn: '1h' });
      return { token };
    }

    const result = await createUser(displayName, email, null);
    await createOAuthUser(result.insertId, provider, providerUserId);

    const token = jwt.sign({ id: result.insertId, username: displayName }, secretKey, { expiresIn: '1h' });
    return { token };
  } catch (error) {
    throw new Error(error as string);
  }
};

module.exports = { authenticateOAuthUser };
