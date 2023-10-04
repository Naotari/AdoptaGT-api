import {DataTypes} from "sequelize"

const Comment = (sequelize) => sequelize.define("Comment", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    post_id: {
        type: DataTypes.INTEGER,
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

export default Comment;