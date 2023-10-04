import { sequelize } from "../db.js";

const Post = sequelize.models.Post
const User = sequelize.models.User

const getAllPosts = async( req, res ) => {
    try {
        const ResponseDB = await Post.findAll({
            include: [User],
        });
        // if (ResponseDB.length === 0) {
            // const users = jsonData[0];
            // User.bulkCreate(users);
        // }

        res.status(201).send(ResponseDB);
    } catch (error) {
        res.status(400).send({
            error: "There was an error with getAllPosts",
            message: error.message,
            error
        })
    }
};

const getPost = async(req, res) => {
    try {
        const idPost = req.params.idPost
        const ResponseDB = await Post.findByPk(idPost);
        if (ResponseDB === null) {
            return res.status(201).send({state: "Post not found"});
        };
        res.status(201).send(ResponseDB);
    } catch (error) {
        res.status(400).send({
            error: "There was an error with getPost",
            message: error.message,
            error
        })
    }
}

const postPost = async(req, res) => {
    try {
        const {user_id, image, text} = req.body;
        const ResponseDB = await Post.create({
            user_id,
            image,
            text
        })
        console.log(ResponseDB);
        res.status(201).send({state: "Created"});
    } catch (error) {
        res.status(400).send({
            error: "There was an error with postPost",
            message: error.message,
            error
        })
    }
}

const updatePost = async(req, res) => {
    try {
        const {idPost, text, state} = req.body;
        const ResponseDB = await Post.update(
            {   
                text,
                state,
            },
            {
                where: { id: idPost }
            }
        )
        res.status(201).send(ResponseDB);
    } catch (error) {
        res.status(400).send({
            error: "There was an error with updatePost",
            message: error.message,
            error
        })
    }
}

const deletePost = async(req, res) => { 
    try {
        const idPost = req.params.idPost
        const ResponseDB = await Post.destroy({
            where: { id: idPost }
        });
        if (ResponseDB === 0) {
            return res.status(201).send({state: "Post was not deleted"});
        }
        res.status(201).send({state: "Deleted"});
    } catch (error) {
        res.status(400).send({
            error: "There was an error with deletePost",
            message: error.message,
            error
        })
    }
}

export {
    getAllPosts,
    getPost,
    postPost,
    updatePost,
    deletePost
}