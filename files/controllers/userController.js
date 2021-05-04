const userModel = require("../models/userModel")
const callResult = require("../functions/callResult")
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)
const jwt = require("jsonwebtoken")
const NM = require('../functions/nodemailer')

// CREATE
exports.createUser = (req, res) => {
   const { name, email, password } = req.body
   const generateUuid = uuidv4()
   try {
      const hashedUserPassword = bcrypt.hashSync(password, salt)
      userModel.newUser(generateUuid, name, email, hashedUserPassword)
      .then((result) => { 
         const payload = { user_id: generateUuid }
         jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 15 }, (err, token) => {
            callResult.returnSuccess(res, 200, {message: result, jwtToken: token})
            NM.sendEmail(token, email, name)
         }) 
      })
      .catch((err) => {
         if(err.code === "23505") { callResult.returnFailed(res, 403, "Email yang ingin di gunakan sudah terdaftar!") }
         else { callResult.returnFailed(res, 400, err.detail) }
      })
      
   } 
   catch (err) { callResult.returnFailed(res, 500, err.message) }
}

// READ
exports.readAllUser = (req, res) => {
   userModel.getAllUser()
   .then((result) => { callResult.returnSuccess(res, 200, result) })
   .catch((err) => { callResult.returnFailed(res, 404, err) })
}
exports.readIdUser = (req, res) => {
   const id = req.params.id
   userModel.getIdUser(id)
   .then((result) => { callResult.returnSuccess(res, 200, result) })
   .catch((err) => { callResult.returnFailed(res, 404, err) })
}

// UPDATE
exports.updateUser = (req, res) => {
   const id = req.params.id
   const { realName, userName, biodata, phoneNumber } = req.body
   try {
      userModel.changeUserData(id, realName, userName, biodata, phoneNumber)
      .then((result) => { callResult.returnSuccess(res, 200, result) })
      .catch((err) => { callResult.returnFailed(res, 400, err) })
   } 
   catch (err) { callResult.returnFailed(res, 500, err.message) }
}

// LOGIN
exports.postUserLogin = (req, res) => {
   const { email, password } = req.body
   userModel.userLogin(email)
   .then((result) => {
      const checkPassword = bcrypt.compareSync(password, result.user_password)
      if (checkPassword === false) { callResult.returnFailed(res, 401, "Gagal login, password salah!") } 
      else {
         userModel.setLoginStateTrue(email)
         .then(() => {
            jwt.sign(result, process.env.JWT_SECRET_KEY, { expiresIn: '1h' }, (err, token) => {
               // // set cookie
               // res.setHeader('Set-Cookie', cookie.serialize('userId', result.user_id, {
               //    httpOnly: true,
               //    maxAge: 60 * 60,
               //    secure: false,
               //    path: '/',
               //    sameSite: 'strict'
               // }));
               callResult.returnSuccess(res, 200, {...result, jwtToken: token})
            })
         })
         .catch((err) => { callResult.returnFailed(res, 404, err) })
      }
   })
   .catch((err) => { callResult.returnFailed(res, 404, err) })
}

// SET LOGIN STATE TO FALSE
exports.falseLoginState = (req, res) => {
   const id = req.params.id
   userModel.setLoginStateFalse(id)
   .then((result) => { callResult.returnSuccess(res, 200, result) })
   .catch((err) => { callResult.returnFailed(res, 404, err) })
}

// CHANGE PASSWORD
exports.updateUserPassword = (req, res) => {
   const userId = req.params.id
   const oldPassword = req.body.old_password
   const newPassword = req.body.new_password
   try {
      if(newPassword.length < 8){ callResult.returnFailed(res, 422, "Gagal mengubah password, minimal password baru harus memiliki 8 karakter!") }
      else if (oldPassword === newPassword) { callResult.returnFailed(res, 403, "Gagal mengubah password, input password lama dan input password baru tidak boleh sama!") }
      else {
         userModel.getIdUser(userId)
         .then((result) => { 
            const checkPassword = bcrypt.compareSync(oldPassword, result.user_password)
            if(checkPassword === false) { callResult.returnFailed(res, 401, "Gagal mengubah password, input password lama salah!") }
            else {
               const hashedUserPassword = bcrypt.hashSync(newPassword, salt)
               userModel.changeUserPassword(userId, hashedUserPassword)
               .then((result) => { callResult.returnSuccess(res, 200, result) })
               .catch((err) => { callResult.returnFailed(res, 404, err) })
            }
         })
         .catch((err) => { callResult.returnFailed(res, 404, err) })
      }
   } 
   catch (err) { callResult.returnFailed(res, 500, err.message) }
}

// VERIFY NEW USER
exports.verifyNewUser = (req, res) => {
   const checkJwtToken = req.params.id
   try {
      if (checkJwtToken === null || checkJwtToken == undefined) { res.json({ checkResult: 'Failed', statusCode: 401, errorDetail: 'Invalid JWT token!' }) } else {
         jwt.verify(checkJwtToken, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
               let errMsg = ''
               if (err.name === 'JsonWebTokenError') { errMsg = 'Token validasi user invalid!' } else if (err.name === 'TokenExpiredError') { errMsg = 'Token validasi user sudah expired!' } else { errMsg = 'Token validasi user tidak aktif!' }
               res.status(401).json({ checkResult: 'Failed', statusCode: 401, jwtError: errMsg })
            } 
            else {
               userModel.userVerificationSuccess(user.user_id)
               .then(() => { callResult.returnSuccess(res, 200, 'Verifikasi user berhasil, silahkan login!') })
               .catch((err) => { callResult.returnFailed(res, 400, err) })
            }
      })
     }
   } catch (err) { res.send('ERROR : ' + err.message) }
}

// GET USER DATA BY JWT
exports.returnLoginTokenAsUserData = (req, res) => {
   const authHeader = req.headers.authorization
   const token = authHeader && authHeader.split(' ')[1]
   if (token === undefined) { callResult.returnFailed(res, 404, "Token JWT tidak boleh kosong!") } 
   else {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
         if(err !== null) {
            let errMsg = ''
            if (err.name === 'JsonWebTokenError') { errMsg = 'Token JWT invalid!' } 
            else if (err.name === 'TokenExpiredError') { errMsg = 'Token JWT sudah expired!' } 
            else { errMsg = 'Token JWT tidak aktif!' }
            callResult.returnFailed(res, 400, errMsg)
         }
         else {
            userModel.getIdUser(user.user_id)
            .then((result) => { callResult.returnSuccess(res, 200, result) })
            .catch((err) => { callResult.returnFailed(res, 404, err) })  
         }
      })
   }
}

// user - upload profile picture
exports.changeUserAvatar = (req, res) => {
   try {
     const userId = req.params.id
     const profilePictureURL = 'http://localhost:2500/img/' + req.file.filename
     userModel.uploadUserProfilePicture(userId, profilePictureURL)
       .then(() => { callResult.returnSuccess(res, 201, 'Berhasil mengganti gambar profil user!') })
       .catch((err) => { callResult.returnFailed(res, 404, err.message) })
   } 
   catch (err) { callResult.returnFailed(res, 400, 'Gagal mengubah avatar user!') }
}