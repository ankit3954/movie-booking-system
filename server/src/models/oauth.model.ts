import {executeQuery} from "../config/db";


export const findOAuthUser = async(provider:string, providerUserId: string) => {
    const result = await executeQuery('SELECT user_id FROM oauth_providers WHERE provider = ? AND provider_user_id = ?', 
    [provider, providerUserId]);
    return result
};

export const createOAuthUser = async(userId:string, provider: string, providerUserId: string) => {
    const result = await executeQuery('INSERT INTO oauth_providers (user_id, provider, provider_user_id) VALUES (?, ?, ?)', 
    [userId, provider, providerUserId]);

    return result
};

module.exports = { findOAuthUser, createOAuthUser };
