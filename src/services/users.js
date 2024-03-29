import jwt from "jsonwebtoken"
import { sequelize } from "../db.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary"
import nodemailer from "nodemailer"

const User = sequelize.models.User
const authenticationTokenKey = process.env.AUTHENTICATION_TOKEN_KEY

const getAllUsers = async( req, res ) => {
    try {
        const ResponseDB = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.status(200).send({state: "ok", content: ResponseDB});
    } catch (error) {
        res.status(500).send({
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
            return res.status(201).send({state: "error", content: "User not found"});
        };
        res.status(200).send({state: "ok", content: ResponseDB});
    } catch (error) {
        res.status(500).send({
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
                res.status(201).send({state: "ok", content:"The user was created"});
                
            } catch (error) {
                if (error.errors[0].message === "email must be unique") {
                    res.status(400).send({state: "ok", content: error.errors[0].message})
                }
                else if (error.errors[0].message === "user_name must be unique") {
                    res.status(400).send({state: "ok", content: error.errors[0].message})
                }
                else {
                    res.status(400).send({state: "ok", content: error.errors[0].message})
                }
            }
        });
    } catch (error) {
        res.status(500).send({
            error: "There was an error with postUser",
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
        res.status(201).send({state: "ok", content: ResponseDB});
    } catch (error) {
        res.status(500).send({
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
            res.status(400).send({state: "error", content: "was not deleted"});
            return;
        }
        res.status(200).send({state: "ok", content: "Deleted"});
    } catch (error) {
        res.status(500).send({
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
            res.status(404).send({ state: "error", content: "User not found"});
            return;
        } else if (ResponseDB.state === "Inactive") {
            res.status(403).send({ state: "error", content: "User was disabled"});
            return;
        }
        bcrypt.compare(password, ResponseDB.password, function(err, result) {
            if (err) {throw err}
            try {
                if (result === false) {
                    res.status(400).send({ state: "error", content: "Incorrect password"});
                } else {
                    const accessToken = jwt.sign(email, authenticationTokenKey)
                    res.status(200).send({state: "ok", content: {accessToken: accessToken}});
                }
            } catch (error) {
                res.status(500).send({
                    error: "There was an error with loginUser",
                    message: error.message,
                    errorDetails: error
                })
            }
        });
        
    } catch (error) {
        res.status(500).send({
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
        console.log(verification.state);
        if (verification.state === "Inactive") {
            res.status(403).send({ state: "error", content: "User was disabled"});
            return
        }
        if (verification) {
            res.status(200).send({ state: "ok", content: {idUser: verification.id}});
            return
        } else {
            res.status(404).send({ state: "error", content: "user not found"});
        }
    } catch (error) {
        res.status(500).send({
            error: "There was an error with verifyUser",
            message: error.message,
            errorDetails: error
        })
    }
}

const verifyEmail = async(req, res) => {
    const {email} = req.body;
    try {
        const response = await User.findOne({ where: { email } })
        if (response) {
            res.status(400).send({ state: "error", content: "There is already a user with that email"});
            return
        } else {
            res.status(200).send({ state: "ok", content: "You can use this email"});
        }
    } catch (error) {
        res.status(500).send({
            error: "There was an error with verifyEmail",
            message: error.message,
            errorDetails: error
        })
    }
}

const changePassword = async(req, res) => {
    const {oldPassword, newPassword, idUser} = req.body;
    if (newPassword === "") {
        res.status(400).send({ state: "error", content: "Password not allowed"});
        return;
    };
    try {
        const ResponseDB = await User.findByPk(idUser, { //Search the user
            attributes: ['password']
        });
        if (!ResponseDB) {
            res.status(404).send({ state: "error", content: "User not found"});
            return;
        };
        bcrypt.compare(oldPassword, ResponseDB.password, function(err, result) { //Check the old password
            if (err) {throw err}
            try {
                if (result === false) {
                    res.status(400).send({ state: "error", content: "Password doesn't match"});
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
                            res.status(201).send({ state: "ok", content: "Password changed"});
                        } catch (error) {
                            res.status(500).send({
                                error: "There was an error with verifyEmail",
                                message: error.message,
                                errorDetails: error
                            })
                        }
                    });
                }
            } catch (error) {
                res.status(500).send({
                    error: "There was an error with verifyPassword",
                    message: error.message,
                    errorDetails: error
                })
            }
        });
    } catch (error) {
        res.status(500).send({
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
            res.status(400).send({ state: "error", content: "There is already a user with that user_name"});
            return
        } else {
            res.status(200).send({ state: "ok", content: "You can use this user_name"});
        }
    } catch (error) {
        res.status(500).send({
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
        .then(result => res.status(200).send({ state: "ok", content: result}));
    } catch (error) {
        res.status(500).send({
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
        res.status(201).send({ state: "ok", content: "Image changed"})
    } catch (error) {
        res.status(500).send({
            error: "There was an error with changeUserImage",
            message: error.message,
            errorDetails: error
        })
    }
}

const recoveryEmailVerification = async(req, res) => {
    const {email} = req.body;
    try {
        const response = await User.findOne({ where: { email } })
        if (response) {
            if (response.state === "Inactive") {
                res.status(403).send({ state: "error", content: "Email Inactive"});
                return
            }
            const accessToken = jwt.sign({email: email}, authenticationTokenKey, { expiresIn : "1h"})
            const urlRecovery = `${process.env.CLIENT_URL}password_reset/${accessToken}/`
            const transporter = nodemailer.createTransport({
            host: "smtp.zoho.com",
            port: 465,
            secure: true, // use TLS
            auth: {
                user: process.env.EMAIL_SERVICE_EMAIL,
                pass: process.env.EMAIL_SERVICE_PASSWORD,
            },
              });
            const info = await transporter.sendMail({
                from: '"Adopta GT" <soporteadoptagt@zohomail.com>', // sender address
                to: email, // list of receivers
                subject: "Recuperacion de contraseña", // Subject line
                text: "Si ve esto necesita visualizar el correo desde un dispositivo compatible.", // plain text body
                html: `<div>
                    <p>Hola, este es un correo para restarurar la contraseña de Adopta GT </br>
                    Ingresa al siguiente link para asignar tu nueva contraseña:</p>
                    <a href=${urlRecovery}>Cambiar Contraseña</a>
                    <br></br>
                    <p>Esta link de restauracion de contraseña solo funcionara por 1 hora.</p>
                    <br></br>
                    <br></br>
                    <p>Adopta GT</p>
                </div>`, // html body
            });
            res.status(200).send({ state: "ok", content: info.response});
            return
        } else {
            res.status(404).send({ state: "error", content: "Email not found"});
        }
    } catch (error) {
        res.status(500).send({
            error: "There was an error with recoveryEmailVerification",
            message: error.message,
            errorDetails: error
        })
    }
}

const recoveryPasswordReset = async(req, res) => {
    try {
        const {password, token} = req.body;
        const user = jwt.verify(token, authenticationTokenKey)
        const ResponseDB = await User.findOne({ where: { email: user.email }, attributes: ['password'] }); //Search the user
        console.log(ResponseDB, token);
        bcrypt.hash(password, 13, async function (err, hash) { // Encript the new password
            if (err) throw err
            try {
                const ResponseDB = await User.update( //Update the password
                { password: hash },
                { where: { email: user.email } }
                )
                res.status(201).send({ state: "ok", content: "Password changed"});
            } catch (error) {
                res.status(500).send({
                    error: "There was an error with verifyEmail",
                    message: error.message,
                    errorDetails: error
                })
            }
        });
    } catch (error) {
        if (error.message === "jwt expired") {
            res.status(401).send({ state: "error", content: "Expired token"})
            return
        }
        res.status(500).send({
            error: "There was an error with recoveryPasswordReset",
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
    recoveryEmailVerification,
    recoveryPasswordReset,
}