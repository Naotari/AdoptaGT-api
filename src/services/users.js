import jwt from "jsonwebtoken"
import { sequelize } from "../db.js";
import bcrypt from "bcrypt";

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
            res.status(201).send({ error:"User not found"});
            return;
        }
        bcrypt.compare(password, ResponseDB.password, function(err, result) {
            if (err) {throw err}
            try {
                if (result === false) {
                    throw  "the password is not the same";
                } else {
                    const accessToken = jwt.sign(email, authenticationTokenKey)
                    res.status(201).send({status: "ok", accessToken: accessToken});
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


export {
    getAllUsers,
    getUser,
    postUser,
    updateUser,
    deleteUser,
    loginUser,
    verifyUser,
    verifyEmail,
    verifyUser_name,
}