const { Router } = require("express");
const adminRouter = Router();
adminRouter.use(adminMiddleware);
const { adminModel} = require("../db")
adminRouter.post("/signup", function (req, res) {
    res.json({
        message: " admin signup endpoint!"
    })
})

adminRouter.post("/signin", function (req, res) {
    res.json({
        message: "admin signed in"
    })
})

adminRouter.post("/course", function (req, res) {
    res.json({
        message: ""
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
