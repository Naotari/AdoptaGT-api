import { Router } from "express"
import {
    getAllAdoptions,
    getAdoption,
    postAdoption,
    updateAdoption,
    deleteAdoption,
    adoptionCount,
    adoptedPetsCount,
} from '../services/adoptions.js';

const adoptions = Router();

adoptions.get("/", getAllAdoptions);
adoptions.get("/:idAdoption", getAdoption);
adoptions.post("/", postAdoption);
adoptions.put("/", updateAdoption);
adoptions.delete("/:idAdoption", deleteAdoption);
adoptions.get("/counts/adoptions", adoptionCount);
adoptions.get("/counts/adopted", adoptedPetsCount);


export default adoptions;