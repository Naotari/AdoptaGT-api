import { Router } from "express"
import {
    getAllAdoptions,
    getAdoption,
    postAdoption,
} from '../services/adoptions.js';

const adoptions = Router();

adoptions.get("/", getAllAdoptions);
adoptions.get("/:idAdoption", getAdoption);
adoptions.post("/", postAdoption);
// adoptions.put("/", updatePost);
// adoptions.delete("/:idPost", deletePost);


export default adoptions;