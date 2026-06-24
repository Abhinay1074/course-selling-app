const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const {userModel,adminModel,courseModel,purchaseModel} = require("./db");
const app = express();


app.use("/api/v1/user",userRouter);
app.use("/api/v1/course",courseRouter); 
app.use("/api/v1/admin",adminRouter);








app.listen(3000);