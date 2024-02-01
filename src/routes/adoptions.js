import { Router } from "express"
import {
    getAllAdoptions,
    getAdoption,
    postAdoption,
    updateAdoption,
    deleteAdoption,
} from '../services/adoptions.js';

const adoptions = Router();

adoptions.get("/", getAllAdoptions);
adoptions.get("/:idAdoption", getAdoption);
adoptions.post("/", postAdoption);
adoptions.put("/", updateAdoption);
adoptions.delete("/:idAdoption", deleteAdoption);


export default adoptions;