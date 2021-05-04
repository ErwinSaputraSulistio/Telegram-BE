// require
const express = require("express")
const route = express.Router()
const userRoute = require("./userRoute")
const chatRoute = require("./chatRoute")

// router
route.use("/user", userRoute)
route.use("/chat", chatRoute)

// exports
module.exports = route