import { app } from "./app.js";
import connectDb from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})

connectDb()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is listening at http://locallhost:${process.env.PORT || 5000}`)
        })
    })
    .catch((err) => {
        console.log(`Connection Error ${err}`)
    })