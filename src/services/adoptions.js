import { sequelize } from "../db.js";
import cloudinary from "cloudinary"

const Adoption = sequelize.models.Adoption

const getAllAdoptions = async( req, res ) => {
    try {
        // const ResponseDB = await Adoption.findAll({
        //     include: [User],
        // });
        const ResponseDB = await Adoption.findAll({
            order: [['createdAt', 'DESC']]
        });

        res.status(201).send(ResponseDB);
    } catch (error) {
        res.status(400).send({
            error: "There was an error with getAllAdoptions",
            message: error.message,
            errorDetails: error
        })
    }
};

const getAdoption = async(req, res) => {
    try {
        const idAdoption = req.params.idAdoption
        const ResponseDB = await Adoption.findByPk(idAdoption);
        if (ResponseDB === null) {
            return res.status(201).send({state: "Adoption not found"});
        };
        res.status(201).send(ResponseDB);
    } catch (error) {
        res.status(400).send({
            error: "There was an error with getAdoption",
            message: error.message,
            errorDetails: error
        })
    }
}

const postAdoption = async(req, res) => {
    try {
        const {user_id, image, sex, name, age, years, text, vaccines, phone} = req.body;
        const ResponseDB = await Adoption.create({
            user_id,
            image,
            sex,
            name,
            age,
            years,
            text,
            vaccines,
            phone,
            adopted: false,
            user_adoption: null
        })
        console.log(ResponseDB);
        res.status(201).send({state: "Created"});
    } catch (error) {
        res.status(400).send({
            error: "There was an error with postAdoption",
            message: error.message,
            errorDetails: error
        })
    }
}

const updateAdoption = async(req, res) => {
    try {
        const {idAdoption, sex, name, age, years, text, vaccines, adopted, state, phone} = req.body;
        const ResponseDB = await Adoption.update(
            {   
                sex,
                name,
                age,
                years,
                text,
                vaccines,
                adopted,
                phone,
                state,
            },
            {
                where: { id: idAdoption }
            }
        )
        res.status(201).send(ResponseDB);
    } catch (error) {
        res.status(400).send({
            error: "There was an error with updateAdoption",
            message: error.message,
            errorDetails: error
        })
    }
}

const deleteAdoption = async(req, res) => { 
    try {
        const idAdoption = req.params.idAdoption

        const adoption = await Adoption.findByPk(idAdoption);
        if (adoption === null) {
            return res.status(404).send({state: "error", message: "Adoption was not found"});
        }

        const imageURL = adoption.image
        let assetName = imageURL.split("/")
        assetName = assetName[9].split(".")
        assetName = assetName[0]
        const cloudinaryResponse = await cloudinary.v2.uploader.destroy("AdoptaGT/adoption_image/" + assetName)
        if(cloudinaryResponse.result === "not found") {
            return res.status(404).send({state: "error", message: "Image of the adoption was not found"});
        };

        const ResponseDB = await Adoption.destroy({
            where: { id: idAdoption }
        });
        if (ResponseDB === 0) {
            return res.status(500).send({state: "error", message: "Adoption was not deleted"});
        }
        res.status(201).send({state: "ok", message:  "Adoption Deleted"});
    } catch (error) {
        res.status(400).send({
            error: "There was an error with deleteAdoption",
            message: error.message,
            errorDetails: error
        })
    }
}

export {
    getAllAdoptions,
    getAdoption,
    postAdoption,
    updateAdoption,
    deleteAdoption,
}