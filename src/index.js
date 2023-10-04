import express from "express"
import 'dotenv/config'
import morgan from "morgan"
import routes from "./routes/index.js"
import { sequelize } from "./db.js"
import cors from "cors"

const server = express()

//middlewares
server.use(cors()); // to accept all income requests
server.use(morgan("dev")); //shows the info of the html requests
server.use(express.urlencoded({extended:false})) //only takes basics format requests
server.use(express.json()); // to support json format in the api

//routes
server.use("/", routes)

//startin the server
server.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`)
})