const db = require("../configs/db")

// CREATE
exports.newChatConnection = (uuid, first, second) => {
   const newUserQuery = 
      "INSERT INTO chat_connection(connection_id, first_id, second_id, created_at) VALUES('" 
      + uuid + "','" + first + "','" + second + "', current_timestamp)"
   return new Promise((resolve, reject) => { 
      db.query(newUserQuery, (err, result) => {
         if (!err) { resolve("Berhasil membuat koneksi chat baru!") } 
         else { reject(err) } 
      }) 
   })
}

// READ
exports.checkChatConnectionByUserId = (id) => {
   const connectionQuery =
      "SELECT * FROM (SELECT CASE WHEN first_id = '" + id + "' \
      THEN JSON_BUILD_OBJECT(\
         'connection_id', connection_id, \
         'user_id', second.user_id, \
         'user_image', second.user_image, \
         'real_name', second.real_name, \
         'phone_number', second.phone_number, \
         'created_at', chat_connection.created_at) \
      ELSE JSON_BUILD_OBJECT(\
         'connection_id', connection_id, \
         'user_id', first.user_id, \
         'user_image', first.user_image, \
         'real_name', first.real_name, \
         'phone_number', first.phone_number, \
         'created_at', chat_connection.created_at) \
      END AS connection_data from chat_connection \
      INNER JOIN users first ON first.user_id = first_id \
      INNER JOIN users second ON second.user_id = second_id \
      WHERE first_id = '" + id + "' \
      OR second_id = '" + id + "' ORDER BY chat_connection.created_at DESC) AS chat_connection"
   return new Promise((resolve, reject) => {
      db.query(connectionQuery, (err, result) => {
         if(result.rows.length === 0) { reject('Tidak dapat menemukan koneksi chat dengan ID user yang berhubungan!') }
         else if (!err) { resolve(result.rows) }
         else { reject(err) }
      })
   })
}

// SAVE CHAT HISTORY
exports.saveChatHistory = (id, sender, receiver, message) => {
   const saveChatQuery = 
      "INSERT INTO chat_history(connection_id, sender_id, receiver_id, message, created_at) VALUES('"
      + id + "','" + sender + "','" + receiver + "','" + message + "', current_timestamp)"
   return new Promise((resolve, reject) => {
      db.query(saveChatQuery, (err, result) => {
         if (!err) { resolve("Berhasil menyimpan histori chat!") } 
         else { reject(err) } 
      })
   })
}

// GET ALL CHAT HISTORY BY CONNECTION ID
exports.getChatHistory = (id) => {
   return new Promise((resolve, reject) => {
      db.query("SELECT * FROM chat_history WHERE connection_id = '" + id + "'", (err, result) => {
         if(result.rows.length === 0) { reject('Tidak dapat menemukan histori chat dengan koneksi ID chat yang berhubungan!') }
         else if (!err) { resolve(result.rows) }
         else { reject(err) }
      })
   })
}

// DELETE ALL CHAT HISTORY BY CONNECTION ID
exports.removeChatHistory = (id) => {
   return new Promise((resolve, reject) => {
      db.query("DELETE FROM chat_history WHERE connection_id = '" + id + "'", (err, result) => {
         if (!err) { resolve("Berhasil hapus chat history!") }
         else { reject(err) }
      })
   })
}

// GET ONLY LATEST CHAT HISTORY BY CONNECTION ID
exports.getLatestHistory = (id) => {
   return new Promise((resolve, reject) => {
      db.query("SELECT * FROM chat_history WHERE connection_id = '" + id + "' ORDER BY created_at DESC LIMIT 1", (err, result) => {
         if(result.rows.length === 0) { reject('Tidak dapat menemukan histori chat dengan koneksi ID chat yang berhubungan!') }
         else if (!err) { resolve(...result.rows) }
         else { reject(err) }
      })
   })
}