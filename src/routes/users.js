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
    changePassword,
    recoveryEmailVerification,
    recoveryPasswordReset,
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
users.post("/change/password", changePassword,)
users.put("/", updateUser);
users.put("/password_recovery/email_verification", recoveryEmailVerification)
users.put("/password_reset", recoveryPasswordReset)
users.delete("/:idUser", deleteUser);
users.delete("/user/image", deleteUserImage)

export default users;