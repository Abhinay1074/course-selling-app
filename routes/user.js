const { Router } = require("express");//{Router}
const bcrypt = require("bcrypt");
const userRouter = Router();
const jwt = require("jsonwebtoken");
const {JWT_USER_PASSWORD} = require("../config");
const { userModel, purchaseModel } = require("../db");
const { userMiddleware } = require("../middlewares/user");

userRouter.post("/signup", async function (req, res) {
    const { email, password, firstName, lastName } = req.body;
    try {
        const hashedpassword = await bcrypt.hash(password, 4);

        await userModel.create({
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

userRouter.post("/signin", async function (req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({
        email: email,
    })
    if (!user) {
        return res.status(403).json({
            message: "user does not exist in the database"
        })
        
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    
    if (passwordMatch) {
        const token = jwt.sign({
            id: user._id.toString()

        }, JWT_USER_PASSWORD)
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

userRouter.get("/purchases",userMiddleware, async function (req, res) {
    const userId = req.userId;
    const purchases = await purchaseModel.find({
       userId,
    })
    res.json({
        purchases
    })
})


module.exports = {
    userRouter: userRouter
}