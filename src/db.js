import { Sequelize } from "sequelize"
import 'dotenv/config'
import User from "./models/user.js";
import Adoption from "./models/adoption.js";
import Comment from "./models/comment.js";
import Post from "./models/post.js";
import jsonData from "../src/necessary_test_information.json" assert { type: "json" };


const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT, FORCE } = process.env;

//new instance
const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`)

//create the models
User(sequelize)
Adoption(sequelize)
Comment(sequelize)
Post(sequelize)

//Create all relations of the models
sequelize.models.User.hasMany(sequelize.models.Post, { foreignKey: 'user_id' });
sequelize.models.Post.belongsTo(sequelize.models.User, { foreignKey: 'user_id' });


//sync de models
const syncModels = async () => {
    await sequelize.sync({ force: FORCE === "true" ? true : false, logging: false });

    //create all test objects
    if (FORCE === "true" ? true : false) {
        await sequelize.models.User.bulkCreate(jsonData[0]);
        await sequelize.models.Adoption.bulkCreate(jsonData[1]);
        await sequelize.models.Post.bulkCreate(jsonData[2]);
    }
    // ------------------------------------------------------------

    console.log("All models were synchronized successfully.");
}
syncModels();
export {
    sequelize,
}