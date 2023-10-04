import {DataTypes} from "sequelize"

const Adoption = (sequelize) => sequelize.define("Adoption", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    sex: {
        type: DataTypes.ENUM,
        values: ['male', 'female'],
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    years: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    vaccines: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    adopted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    user_adoption: {
        type: DataTypes.INTEGER,
        allowNull: true,
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

export default Adoption;