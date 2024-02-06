import sequelize from "../db/sequelize.js";


export const checkConnection = async () => {
    return await sequelize.authenticate();
}