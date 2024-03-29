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

        res.status(200).send({state: "ok", content: ResponseDB});
    } catch (error) {
        res.status(500).send({
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
            return res.status(404).send({state: "error", content: "Adoption not found"});
        };
        res.status(200).send({state: "ok", content: ResponseDB});
    } catch (error) {
        res.status(500).send({
            error: "There was an error with getAdoption",
            message: error.message,
            errorDetails: error
        })
    }
}

const postAdoption = async(req, res) => {
    try {
        const {user_id, image, sex, name, age, years, text, vaccines, pet_type, phone} = req.body;
        const ResponseDB = await Adoption.create({
            user_id,
            image,
            sex,
            name,
            age,
            years,
            text,
            vaccines,
            pet_type,
            phone,
            adopted: false,
            user_adoption: null
        })
        console.log(ResponseDB);
        res.status(201).send({state: "ok", content: "Created"});
    } catch (error) {
        res.status(500).send({
            error: "There was an error with postAdoption",
            message: error.message,
            errorDetails: error
        })
    }
}

const updateAdoption = async(req, res) => {
    try {
        const {idAdoption, sex, name, age, years, text, vaccines, pet_type, adopted, state, phone} = req.body;
        const ResponseDB = await Adoption.update(
            {   
                sex,
                name,
                age,
                years,
                text,
                vaccines,
                pet_type,
                adopted,
                phone,
                state,
            },
            {
                where: { id: idAdoption }
            }
        )
        res.status(201).send({state: "ok", content: ResponseDB});
    } catch (error) {
        res.status(500).send({
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
            return res.status(404).send({state: "error", content: "Adoption was not found"});
        }

        const imageURL = adoption.image
        let assetName = imageURL.split("/")
        assetName = assetName[9].split(".")
        assetName = assetName[0]
        const cloudinaryResponse = await cloudinary.v2.uploader.destroy("AdoptaGT/adoption_image/" + assetName)
        if(cloudinaryResponse.result === "not found") {
            return res.status(404).send({state: "error", content: "Image of the adoption was not found"});
        };

        const ResponseDB = await Adoption.destroy({
            where: { id: idAdoption }
        });
        if (ResponseDB === 0) {
            return res.status(404).send({state: "error", content: "Adoption was not deleted"});
        }
        res.status(200).send({state: "ok", content: "Adoption Deleted"});
    } catch (error) {
        res.status(500).send({
            error: "There was an error with deleteAdoption",
            message: error.message,
            errorDetails: error
        })
    }
}

const adoptionCount = async(req , res) => {
    try {
        const adoptionNumber = await Adoption.findAll();
        console.log(adoptionNumber.length);

        res.status(200).send({state: "ok", content: adoptionNumber.length});
    } catch (error) {
        res.status(500).send({
            error: "There was an error with adoptionCount",
            message: error.message,
            errorDetails: error
        })
    }
}

const adoptedPetsCount = async(req , res) => {
    try {
        const adoptionNumber = await Adoption.findAll({
            where: { adopted: true }
        });
        res.status(200).send({state: "ok", content: adoptionNumber.length});
    } catch (error) {
        res.status(500).send({
            error: "There was an error with adoptionCount",
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
    adoptionCount,
    adoptedPetsCount,
}