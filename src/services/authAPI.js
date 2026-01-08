import commonAPI from "./CommonAPI";
import { SERVER_URL } from "./SERVERURL";

// Login
export const loginAPI = async (reqBody) => {
  return await commonAPI("POST", `${SERVER_URL}/api/auth/login`, reqBody);
};

// Register
export const registerAPI = async (reqBody) => {
  return await commonAPI("POST", `${SERVER_URL}/api/auth/register`, reqBody);
};

