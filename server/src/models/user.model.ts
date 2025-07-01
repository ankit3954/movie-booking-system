import {executeQuery} from "../config/db";

const findUserByEmail = async(email: string) => {
    return await executeQuery('SELECT * FROM users WHERE email = ?', [email]);
};

export const createUser = async(username:string, email: string, password: string | null) => {
  return await executeQuery('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
    [username, email, password]);
};

module.exports = { findUserByEmail, createUser };
