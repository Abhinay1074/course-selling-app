const { Router } = require("express");
const courseRouter = Router();
const{userMiddleware} = require("../middlewares/user")
const{purchaseModel,courseModel} = require("../db");

courseRouter.post("/purchase",userMiddleware,async function (req, res) {

    const userId = req.userId;
    const courseId = req.body.courseId;
    const course = await courseModel.findById(courseId);

    if (!course) {
        return res.status(404).json({
            message: "course not found"
        });
    }

    const existingPurchase = await purchaseModel.findOne({
        userId,
        courseId
    });

    if (existingPurchase) {
        return res.status(409).json({
            message: "you have already bought this course"
        });
    }

    await purchaseModel.create({
        userId,courseId
    })
    res.json({
        message: "you have successfully bought the course!"
    })
})


courseRouter.get("/preview", async function (req, res) {

    const courses  = await courseModel.find({});
    res.json({
       courses
    })
})
module.exports = {
    courseRouter : courseRouter
}
