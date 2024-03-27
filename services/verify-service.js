import EmailTracking from "../models/EmailTracking.js";
import { fetchUser } from "./user-service.js";


export const userVerification = async (token) => {
    const user = await EmailTracking.findOne({ where: { token: token } });
    return await user;
}

export const setVerification = async (email) => {
    const user = await fetchUser(email);
    user.is_verified = true;
    await user.save();
    return await user;
}