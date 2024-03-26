import { BOOLEAN, DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

const User = sequelize.define('User', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    account_created: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    account_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: false,
  });

export default User;

