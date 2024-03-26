import sequelize from "../db/sequelize.js";
import User from "../models/User.js";
import { fetchUser } from "./user-service.js";

export const userVerification = async (token) => {
    const user = await sequelize.query('SELECT "email","expiryTime" FROM "email_tracking" WHERE "email_tracking"."token" = (:id)', {
        replacements: {id: token},
        type: sequelize.QueryTypes.SELECT
      });
    return await user;
}

export const setVerification = async (email) => {
    const user = await fetchUser(email);
    user.is_verified = true;
    await user.save();
    return user;
}