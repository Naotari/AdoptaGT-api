import {DataTypes} from "sequelize"

const Post = (sequelize) => sequelize.define("Post", {
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
    text: {
        type: DataTypes.TEXT,
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



export default Post;