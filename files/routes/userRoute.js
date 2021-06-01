const express = require("express")
const route = express.Router()
const userController = require("../controllers/userController")
const jwtCheck = require("../functions/JWT")
const { uploadAvatar } = require('../functions/multer')

route
   // CRUD
   .post("/", userController.createUser)
   .get("/", userController.readAllUser)
   .get("/:id", userController.readIdUser)
   .put("/:id", jwtCheck.verifyJwtToken, userController.updateUser)
   // AUTH
   .post("/login", userController.postUserLogin)
   .get("/logout/:id", userController.falseLoginState)
   .patch("/change/password/:id", jwtCheck.verifyJwtToken, userController.updateUserPassword)
   .get('/verify/:id', userController.verifyNewUser)
   .post('/jwt', userController.returnLoginTokenAsUserData)
   .patch('/change/avatar/:id', jwtCheck.verifyJwtToken, uploadAvatar, userController.changeUserAvatar)
   .post('/reset/send-mail', userController.sendResetPasswordMail)
   .put('/reset/new-password', userController.resetPassword)
   .get('/reset/:id', userController.checkIfJwtResetValid)

module.exports = route