
import User from "../models/User.js";

export const addUser = async (user = {}) => {
    const newUser = User.create(user);
    return await newUser;
}

export const fetchUser = async (email) => {
    const newUser = await User.findOne({ where: { username: email } });
    return await newUser;
}
