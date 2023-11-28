import jwt from "jsonwebtoken"
import { sequelize } from "../db.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary"

const User = sequelize.models.User
const authenticationTokenKey = process.env.AUTHENTICATION_TOKEN_KEY

//Temp
import jsonData from "./users.json" assert { type: "json" };

const getAllUsers = async( req, res ) => {
    try {
        const ResponseDB = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        if (ResponseDB.length === 0) {
            const users = jsonData[0];
            User.bulkCreate(users);
        }
        res.status(201).send(ResponseDB);
    } catch (error) {
        res.status(400).send({
            error: "There was an error with getAllUsers",
            message: error.message,
            errorDetails: error
        })
    }
};

const getUser = async(req, res) => {
    try {
        const idUser = req.params.idUser
        const ResponseDB = await User.findByPk(idUser, {
            attributes: { exclude: ['password'] }
        });
        if (ResponseDB === null) {
            return res.status(201).send({state: "User not found"});
        };
        res.status(201).send(ResponseDB);
    } catch (error) {
        res.status(400).send({
            error: "There was an error with getUser",
            message: error.message,
            errorDetails: error
        })
    }
}

const postUser = async(req, res) => {
    try {
        const {user_name, name, last_name, email, password, image, role} = req.body;

        bcrypt.hash(password, 13, async function(err, hash) {
            if (err) {
                throw err
            }
            try {
                console.log("la pass es", hash);
        
                const ResponseDB = await User.create({
                    user_name,
                    name,
                    last_name,
                    email,
                    password: hash,
                    image,
                    role: role || "user"
                })
                // console.log(ResponseDB);
                res.status(201).send({status: "OK", message:"The user was created"});
                
            } catch (error) {
                if (error.errors[0].message === "email must be unique") {
                    res.status(400).send({
                        error: "There was an error with postUser",
                        message: error.errors[0].message,
                        errorDetails: error
                    })
                }
                else if (error.errors[0].message === "user_name must be unique") {
                    res.status(400).send({
                        error: "There was an error with postUser",
                        message: error.errors[0].message,
                        errorDetails: error
                    })
                }
                else {
                    res.status(400).send({
                        error: "There was an error with postUser",
                        message: error.message,
                        errorDetails: error
                    })
                }
            }
        });
    } catch (error) {
        res.status(400).send({
            error: "There was an error Encripting password",
            message: error.message,
            errorDetails: error
        })
    }
}

const updateUser = async(req, res) => {
    try {
        const {idUser, user_name, name, last_name, email, password, role, state} = req.body;
        const ResponseDB = await User.update(
            {   
                user_name,
                name,
                last_name,
                email,
                password,
                role,
                state,
            },
            {
                where: { id: idUser }
            }
        )
        res.status(201).send(ResponseDB);
    } catch (error) {
        res.status(400).send({
            error: "There was an error with updateUser",
            message: error.message,
            errorDetails: error
        })
    }
}

const deleteUser = async(req, res) => { 
    try {
        const idUser = req.params.idUser
        const ResponseDB = await User.destroy({
            where: { id: idUser }
        });
        if (ResponseDB === 0) {
            res.status(201).send({status:"error", message:"was not deleted"});
            return;
        }
        res.status(201).send({status:"ok", message:"Deleted"});
    } catch (error) {
        res.status(400).send({
            error: "There was an error with deleteUser",
            message: error.message,
            errorDetails: error
        })
    }
}

const loginUser = async(req, res) => {
    try {
        const {email, password} = req.body
        const ResponseDB = await User.findOne({ where: { email: email } });
        
        if (!ResponseDB) {
            res.status(200).send({ status: "error", error:"User not found"});
            return;
        }
        bcrypt.compare(password, ResponseDB.password, function(err, result) {
            if (err) {throw err}
            try {
                if (result === false) {
                    res.status(200).send({ status: "error", error: "Incorrect password"});
                } else {
                    const accessToken = jwt.sign(email, authenticationTokenKey)
                    res.status(200).send({status: "ok", accessToken: accessToken});
                }
            } catch (error) {
                res.status(400).send({
                    error: "There was an error with loginUser",
                    message: error.message,
                    errorDetails: error
                })
            }
        });
        
    } catch (error) {
        res.status(400).send({
            error: "There was an error with loginUser",
            message: error.message,
            errorDetails: error
        })
    }
}

const verifyUser = async(req, res) => {
    const { token } =  req.body;
    try {
        const user = jwt.verify(token, authenticationTokenKey)
        console.log(user);
        const verification = await User.findOne({ where: { email: user } });
        console.log(verification);
        if (verification) {
            res.status(201).send({idUser: verification.id});
            return
        } else {
            res.status(201).send({error: "user not found"});
        }
    } catch (error) {
        console.log(error);
    }
}

const verifyEmail = async(req, res) => {
    const {email} = req.body;
    try {
        const response = await User.findOne({ where: { email } })
        if (response) {
            res.status(201).send({message: "There is already a user with that email"});
            return
        } else {
            res.status(201).send({message: "You can use this email"});
        }
    } catch (error) {
        res.status(400).send({
            error: "There was an error with verifyEmail",
            message: error.message,
            errorDetails: error
        })
    }
}

const changePassword = async(req, res) => {
    const {oldPassword, newPassword, idUser} = req.body;
    try {
        const ResponseDB = await User.findByPk(idUser, { //Search the user
            attributes: ['password']
        });
        if (!ResponseDB) {
            res.status(200).send({ error:"User not found"});
            return;
        };
        bcrypt.compare(oldPassword, ResponseDB.password, function(err, result) { //Check the old password
            if (err) {throw err}
            try {
                if (result === false) {
                    res.status(200).send({ error:"Password doesn't match"});
                } else {
                    bcrypt.hash(newPassword, 13, async function (err, hash) { // Encript the new password
                        if (err) {
                            throw err
                        }
                        try {
                            const ResponseDB = await User.update( //Update the password
                                { password: hash },
                                { where: { id: idUser } }
                            )
                            res.status(200).send({message: "Password changed"});
                        } catch (error) {
                            res.status(400).send({
                                error: "There was an error with verifyEmail",
                                message: error.message,
                                errorDetails: error
                            })
                        }
                    });
                }
            } catch (error) {
                res.status(400).send({
                    error: "There was an error with verifyPassword",
                    message: error.message,
                    errorDetails: error
                })
            }
        });
    } catch (error) {
        res.status(400).send({
            error: "There was an error with verifyPassword",
            message: error.message,
            errorDetails: error
        })
    }
}

const verifyUser_name = async(req, res) => {
    const {user_name} = req.body;
    console.log(user_name); 
    try {
        const response = await User.findOne({ where: { user_name } })
        if (response) {
            res.status(201).send({message: "There is already a user with that user_name"});
            return
        } else {
            res.status(201).send({message: "You can use this user_name"});
        }
    } catch (error) {
        res.status(400).send({
            error: "There was an error with verifyUser_name",
            message: error.message,
            errorDetails: error
        })
    }
}

const deleteUserImage = async(req, res) => {
    try {
        const imageURL = req.body.imageURL
        let assetName = imageURL.split("/")
        assetName = assetName[9].split(".")
        assetName = assetName[0]
        console.log(assetName);
        cloudinary.v2.uploader.destroy("AdoptaGT/user_image/" + assetName)
        .then(result => res.status(201).send(result));
        // res.status(201).send({message: "Fue elimiando"});
    } catch (error) {
        res.status(400).send({
            error: "There was an error with deleteUserImage",
            message: error.message,
            errorDetails: error
        })
    }
}

const changeUserImage = async(req, res) => {
    
    try {

        const imageURL = req.body.previous_Image_url
        let assetName = imageURL.split("/")
        assetName = assetName[9].split(".")
        assetName = assetName[0]
        console.log(assetName);
        cloudinary.v2.uploader.destroy("AdoptaGT/user_image/" + assetName)
        .then(result => {console.log(result)});

        const ResponseDB = await User.update(
            {   
                image: req.body.new_Image_url
            },
            {
                where: { id: req.body.idUser }
            }
        )
        console.log(ResponseDB);
        res.status(201).send("funciona")
    } catch (error) {
        res.status(400).send({
            error: "There was an error with changeUserImage",
            message: error.message,
            errorDetails: error
        })
    }
}


export {
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
}