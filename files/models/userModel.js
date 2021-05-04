const db = require("../configs/db")

// CREATE
exports.newUser = (uuid, name, email, password) => {
   const newUserQuery = 
      "INSERT INTO users(user_id, real_name, user_email, user_password, user_name, biodata, phone_number, last_login, updated_at, created_at, user_image, verified) VALUES('" 
      + uuid + "','" + name + "','" + email + "','" + password + "','Anonymous','A new member of Telegram parallel world.', '81312345678', null, current_timestamp, current_timestamp, 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg', false)"
   return new Promise((resolve, reject) => { 
      db.query(newUserQuery, (err, result) => {
         if (!err) { resolve("Berhasil membuat user baru, silahkan verifikasi email dahulu agar bisa login!") } 
         else { reject(err) } 
      }) 
   })
}

// READ
exports.getAllUser = () => {
   return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users ORDER BY id DESC", (err, result) => {
         if (!err) { resolve(result.rows) } else { reject(err) }
      })
   })
}
exports.getIdUser = (id) => {
   return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE user_id = '" + id + "'", (err, result) => {
         if(result.rows.length === 0) { reject('Tidak dapat menemukan user dengan ID yang dicari!') }
         else if (err) { reject(err) }
         else { resolve(...result.rows) }
      })
   })
}

// UPDATE
exports.changeUserData = (
   id, 
   realName = "Kuuhaku", 
   userName = "Anonymous", 
   biodata = "A member of Telegram with some secrets.", 
   phoneNumber = "81312345678"
   ) => {
   const updateUserQuery = 
      "UPDATE users SET real_name = '" + realName + 
      "', user_name = '" + userName + 
      "', biodata = '" + biodata +
      "', phone_number = '" + phoneNumber +
      "', updated_at = current_timestamp WHERE user_id = '" + id + "'"
   return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE user_id = '" + id + "'", (err, result) => {
         if(result.rows.length === 0) { reject('Tidak dapat menemukan user dengan ID yang dicari!') }
         else if (err) { reject(err) }
         else { 
            db.query(updateUserQuery, (err, result) => {
               if (!err) { resolve("Berhasil mengubah data user!") } 
               else { reject(err) } 
            }) 
         }
      }) 
   })
}

// LOGIN
exports.userLogin = (email) => {
   return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE user_email = '" + email + "'", (err, result) => {
         if (result.rows.length === 0) { reject("Gagal login, email belum terdaftar!") } 
         else if (result.rows[0].verified === false) { reject("Gagal login, email belum di verifikasi!") }
         else { resolve(...result.rows) }
      })
   })
}

// CHANGE PASSWORD
exports.changeUserPassword = (id, password) => {
   const updatePasswordQuery = "UPDATE users SET user_password = '" + password + "' WHERE user_id = '" + id + "'"
   return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE user_id = '" + id + "'", (err, result) => {
         if(result.rows.length === 0) { reject('Tidak dapat menemukan user dengan ID yang dicari!') }
         else if (err) { reject(err) }
         else { 
            db.query(updatePasswordQuery, (err, result) => {
               if (!err) { resolve("Berhasil mengubah password user!") } 
               else { reject(err) } 
            }) 
         }
      }) 
   })
}

// VERIFY USER
exports.userVerificationSuccess = (userId) => {
   return new Promise((resolve, reject) => {
     db.query("UPDATE users SET verified = true WHERE user_id = '" + userId + "'", (err, result) => {
       if (!err) { resolve(result) } else { reject(err) }
     })
   })
}

// CHANGE PROFILE PICTURE
 exports.uploadUserProfilePicture = (userId, profilePicture) => {
   return new Promise((resolve, reject) => {
      db.query("UPDATE users SET user_image = '" + profilePicture + "' WHERE user_id = '" + userId + "'", (err, result) => {
         if (!err) { resolve(result) } else { reject(err) }
      })
   })
}

// SET LOGIN STATE
exports.setLoginStateTrue = (email) => {
   return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE user_email = '" + email + "'", (err, result) => {
         if (result.rows.length === 0) { reject("Gagal login, email belum terdaftar!") } 
         else if (result.rows[0].now_login === true) { reject("Gagal login, orang lain sedang login menggunakan akun ini!") }
         else { 
            db.query("UPDATE users SET now_login = true WHERE user_email = '" + email + "'", (err, result) => {
               if (!err) { resolve("Berhasil login!") } else { reject(err) }
            }) 
         }
      })
   })
}
exports.setLoginStateFalse = (id) => {
   return new Promise((resolve, reject) => {
      db.query("UPDATE users SET now_login = false WHERE user_id = '" + id + "'", (err, result) => {
         if (!err) { resolve("Berhasil logout!") } else { reject(err) }
      }) 
   })
}