import { sequelize } from "../db.js";

const Adoption = sequelize.models.Adoption

const getAllAdoptions = async( req, res ) => {
    try {
        // const ResponseDB = await Adoption.findAll({
        //     include: [User],
        // });
        const ResponseDB = await Adoption.findAll();

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
        const ResponseDB = await Post.update(
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
            error: "There was an error with updatePost",
            message: error.message,
            errorDetails: error
        })
    }
}

const deleteAdoption = async(req, res) => { 
    try {
        const idAdoption = req.params.idAdoption

        const adoptionDB = await Adoption.findByPk(idAdoption);
        console.log(adoptionDB);
        // const ResponseDB = await Adoption.destroy({
        //     where: { id: idAdoption }
        // });
        // if (ResponseDB === 0) {
        //     return res.status(201).send({state: "Adoption was not deleted"});
        // }
        res.status(201).send({state: "Deleted"});
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