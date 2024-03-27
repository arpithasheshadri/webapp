import sequelize from "../db/sequelize.js";
import User from "../models/User.js";
import EmailTracking from "../models/EmailTracking.js";
import { fetchUser } from "./user-service.js";
import logger from '../controllers/logger'

export const userVerification = async (token) => {
    logger.info({message:`i am here token ${token}`,severity: 'INFO'});
    const user = await EmailTracking.findOne({ where: { token: token } });
    logger.info({message:`i am here object retrieved ${user}`,severity: 'INFO'});
    return await user;
}

export const setVerification = async (email) => {
    const user = await fetchUser(email);
    user.is_verified = true;
    await user.save();
    return await user;
}