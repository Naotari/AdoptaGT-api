import { Router } from "express"
import {
    getAllUsers,
    getUser,
    postUser,
    updateUser,
    deleteUser,
    deleteUserImage,
    loginUser,
    verifyUser,
    verifyEmail,
    verifyUser_name,
    changeUserImage,
} from '../services/users.js';

const users = Router();

users.get("/", getAllUsers);
users.get("/:idUser", getUser);
users.post("/", postUser);
users.post("/login", loginUser);
users.post("/verify", verifyUser)
users.post("/verify/email", verifyEmail)
users.post("/verify/user_name", verifyUser_name)
users.post("/user/image_update", changeUserImage)
users.put("/", updateUser);
users.delete("/:idUser", deleteUser);
users.delete("/user/image", deleteUserImage)

export default users;