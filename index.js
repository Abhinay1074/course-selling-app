const express = require("express");
const mongoose = require("mongoose");
async function main() {
 await mongoose.connect("mongodb+srv://abhinaysahai2004_db_user:ZBXQWiln0tQiVfOW@cluster0.pyj0gta.mongodb.net/courseselling-app-Data")
}
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const {userModel,adminModel,courseModel,purchaseModel} = require("./db");
const app = express();
app.use(express.json());


app.use("/api/v1/user",userRouter);
app.use("/api/v1/course",courseRouter); 
app.use("/api/v1/admin",adminRouter);



console.log("connected to database");





app.listen(3000,()=>{
    console.log("listening on port 3000");
});
main();