import { Router } from "express"
import {
    getAllPosts,
    getPost,
    postPost,
    updatePost,
    deletePost
} from '../services/posts.js';

const posts = Router();

posts.get("/", getAllPosts);
posts.get("/:idPost", getPost);
posts.post("/", postPost);
posts.put("/", updatePost);
posts.delete("/:idPost", deletePost);


export default posts;