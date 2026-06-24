const { Router }= require("express");//{Router}

const userRouter = Router();


    userRouter.post("//signup", function (req, res) {
        const userEmail = req.body.email;
        const password = req.body.password;
        const firstName = req.body.firstName;
        const lasttName = req.body.lasttName;
        res.json({
            message: "signup endpoint!"
        })
    })

    userRouter.post("/signin", function (req, res) {
        res.json({
            message: ""
        })
    })

    userRouter.get("/purchases", function (req, res) {
        res.json({
            message: "signup endpoint!"
        })
    })


module.exports = {
    userRouter : userRouter
}