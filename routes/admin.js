const { Router } = require("express");
const adminRouter = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const{JWT_ADMIN_PASSWORD} = require("../config");
const { adminModel, courseModel } = require("../db");
const { adminMiddleware } = require("../middlewares/admin");

adminRouter.post("/signup", async function (req, res) {
    const { email, password, firstName, lastName } = req.body;
    try {
        const hashedpassword = await bcrypt.hash(password, 4);

        await adminModel.create({
            email: email,
            password: hashedpassword,
            firstName: firstName,
            lastName: lastName
        });
    }
    catch (e) {
        return res.json({
            message: "signup failed!"
        })

    }
    res.json({
        message: "signup successful!"
    })
})

adminRouter.post("/signin", async function (req, res) {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({
        email: email,
    })
    if (!admin) {
        return res.status(403).json({
            message: "admin does not exist in the database"
        })
        
    }

    const passwordMatch = await bcrypt.compare(password, admin.password)
    console.log(admin);
    if (passwordMatch) {
        const token = jwt.sign({
            id: admin._id.toString()

        }, JWT_ADMIN_PASSWORD)
        res.json({
            token: token

        })
    }
    else {
        res.status(401).json({
            message: "credentials are wrong or invalid"
        })
    }
})

adminRouter.post("/course",adminMiddleware,async function (req, res) {
    const adminId = req.adminId;
    const{title,description,imageURL,price} = req.body;
    const course = await courseModel.create({
        title:title,
        description:description,
        imageUrl:imageURL,
        price:price,
        creatorId:adminId
    })
    res.json({
        message: "course created",
        courseId:course._id
    })
})
adminRouter.put("/course", function (req, res) {
    res.json({

    })
})
adminRouter.get("/course/bulk", function (req, res) {
    res.json({
        message: ""
    })
})

module.exports = {
    adminRouter: adminRouter
}
