require("dotenv").config({
    path: __dirname + "/.env"
});
console.log("this the link for mongo db"+process.env.MONGO_URL);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");


const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/admin", adminRouter);



async function main(){

    try{

        await mongoose.connect(process.env.MONGOURL);

        console.log("MongoDB connected");

        app.listen(3000,()=>{
            console.log("Server running on port 3000");
        });

    }
    catch(e){
        console.log("MongoDB connection failed");
        console.log(e);
    }

}


main();
