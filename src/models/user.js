import {DataTypes} from "sequelize"

const User = (sequelize) => sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM,
        values: ['user', 'admin', 'moderator'],
        allowNull: false,
    },
    state: {
        type: DataTypes.ENUM,
        values: ['Inactive', 'Active'],
        defaultValue: 'Active',
    },
},
{
    timestamps: true
});

export default User;