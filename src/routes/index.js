import { Router } from "express";
import users from "./users.js";
import posts from "./posts.js";
import adoptions from "./adoptions.js";

const router = Router();

router.use("/users", users)
router.use("/posts", posts)
router.use("/adoptions", adoptions)


export default router