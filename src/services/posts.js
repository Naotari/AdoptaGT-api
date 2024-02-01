import { sequelize } from "../db.js";
import cloudinary from "cloudinary"

const Post = sequelize.models.Post
const User = sequelize.models.User

const getAllPosts = async( req, res ) => {
    try {
        const ResponseDB = await Post.findAll({
            include: [User],
            order: [['createdAt', 'DESC']]
        });

        res.status(201).send(ResponseDB);
    } catch (error) {
        res.status(400).send({
            error: "There was an error with deleteUserImage",
            message: error.message,
            errorDetails: error
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
            error: "There was an error with deleteUserImage",
            message: error.message,
            errorDetails: error
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
            error: "There was an error with deleteUserImage",
            message: error.message,
            errorDetails: error
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
            error: "There was an error with deleteUserImage",
            message: error.message,
            errorDetails: error
        })
    }
}

const deletePost = async(req, res) => { 
    try {
        const idPost = req.params.idPost
        const post = await Post.findByPk(idPost);
        if (post === null) {
            return res.status(404).send({state: "error", message: "Post was not found"});
        }
        if (post.image.length > 0) {
            const imageURL = post.image
            let assetName = imageURL.split("/")
            assetName = assetName[9].split(".")
            assetName = assetName[0]
            const cloudinaryResponse = await cloudinary.v2.uploader.destroy("AdoptaGT/post_image/" + assetName)
            if(cloudinaryResponse.result === "not found") {
                return res.status(404).send({state: "error", message: "Image of the post was not found"});
            };
        }
        const ResponseDB = await Post.destroy({
            where: { id: idPost }
        });
        if (ResponseDB === 0) {
            return res.status(500).send({state: "error", message: "Post was not deleted"});
        }
        res.status(201).send({state: "ok", message:  "Post Deleted"});
    } catch (error) {
        res.status(400).send({
            error: "There was an error with deleteUserImage",
            message: error.message,
            errorDetails: error
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