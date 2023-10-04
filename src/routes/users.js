import { Router } from "express"
import {
    getAllUsers,
    getUser,
    postUser,
    updateUser,
    deleteUser,
    loginUser,
    verifyUser,
    verifyEmail,
    verifyUser_name,
} from '../services/users.js';

const users = Router();

users.get("/", getAllUsers);
users.get("/:idUser", getUser);
users.post("/", postUser);
users.post("/login", loginUser);
users.post("/verify", verifyUser)
users.post("/verify/email", verifyEmail)
users.post("/verify/user_name", verifyUser_name)
users.put("/", updateUser);
users.delete("/:idUser", deleteUser);

export default users;