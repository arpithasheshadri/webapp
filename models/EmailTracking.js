import { BOOLEAN, DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

const EmailTracking = sequelize.define('email_tracking', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiryTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

export default EmailTracking;