const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ObjectId = mongoose.Types.ObjectId;

async function connectDB() {
    await mongoose.connect(
        "mongodb+srv://abhinaysahai2004_db_user:ZBXQWiln0tQiVfOW@cluster0.pyj0gta.mongodb.net/courseselling-app-Data"
    );

    console.log("Database connected");
}

connectDB();
const userSchema = new Schema({
    email:{type:String,unique:true},
    password:String,
    firstName:String,
    lastName:String
});

const adminSchema=  new Schema({
     email:{type:String,unique:true},
     password:String,
     firstName:String,
     lastName:String

});

const courseSchema =  new Schema({
    title:String,
    description:String,
    price:Number,
    imageUrl:String,
    creatorId: ObjectId

});

const purchaseSchema = new Schema({
    userId: ObjectId,
    courseId: ObjectId

});

const userModel = mongoose.model("user",userSchema);
const adminModel = mongoose.model("admin",adminSchema);
const courseModel = mongoose.model("course",courseSchema);
const purchaseModel = mongoose.model("purchase",purchaseSchema);


module.exports = {
    userModel,adminModel,courseModel,purchaseModel
}