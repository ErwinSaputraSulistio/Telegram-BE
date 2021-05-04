const userModel = require("../models/userModel")
const chatModel = require("../models/chatModel")
const callResult = require("../functions/callResult")
const { v4: uuidv4 } = require('uuid')

// CREATE
exports.createChatConnection = (req, res) => {
   const { first_id, second_id } = req.body
   const generateUuid = uuidv4()
   try {
      userModel.getIdUser(first_id)
      .then(() => { 
         userModel.getIdUser(second_id)
         .then(() => { 
            chatModel.newChatConnection(generateUuid, first_id, second_id)
            .then((result) => { callResult.returnSuccess(res, 200, result) })
            .catch((err) => {
               if(err.code === "23505") { callResult.returnFailed(res, 500, "Ada kesalahan dalam sistem, silahkan coba lagi!") }
               else { callResult.returnFailed(res, 400, err.detail) }
            })
         })
         .catch((err) => { callResult.returnFailed(res, 404, "ID user kedua tidak valid!") })
      })
      .catch((err) => { callResult.returnFailed(res, 404, "ID user pertama tidak valid!") })
   }
   catch (err) { callResult.returnFailed(res, 500, err.message) }
}

// READ
exports.readChatConnectionByUserId = (req, res) => {
   const id = req.params.id
   try {
      chatModel.checkChatConnectionByUserId(id)
      .then((result) => { callResult.returnSuccess(res, 200, result) })
      .catch((err) => { callResult.returnFailed(res, 400, err) })
   }
   catch (err) { callResult.returnFailed(res, 500, err.message) }
}

// SAVE CHAT HISTORY
exports.backupChat = (req, res) => {
   const { id, sender, receiver, message } = req.body
   try {
      userModel.getIdUser(sender)
      .then(() => { 
         userModel.getIdUser(receiver)
         .then(() => { 
            chatModel.saveChatHistory(id, sender, receiver, message)
            .then((result) => { callResult.returnSuccess(res, 200, result) })
            .catch((err) => {
               if(err.code === "23505") { callResult.returnFailed(res, 500, "Ada kesalahan dalam sistem, silahkan coba lagi!") }
               else { callResult.returnFailed(res, 400, err.detail) }
            })
         })
         .catch((err) => { callResult.returnFailed(res, 404, "ID penerima pesan tidak valid!") })
      })
      .catch((err) => { callResult.returnFailed(res, 404, "ID pengirim pesan tidak valid!") })
   }
   catch (err) { callResult.returnFailed(res, 500, err.message) }
}

// GET CHAT HISTORY
exports.readChatHistory = (req, res) => {
   const id = req.params.id
   try {
      chatModel.getChatHistory(id)
      .then((result) => { callResult.returnSuccess(res, 200, result) })
      .catch((err) => { callResult.returnFailed(res, 400, err) })
   }
   catch (err) { callResult.returnFailed(res, 500, err.message) }
}

// DELETE CHAT HISTORY
exports.deleteChatHistory = (req, res) => {
   const id = req.params.id
   try { 
      chatModel.getChatHistory(id)
      .then(() => { 
         chatModel.removeChatHistory(id)
         .then((result) => { callResult.returnSuccess(res, 200, result) })
         .catch((err) => { callResult.returnFailed(res, 400, err) })
      })
      .catch((err) => { callResult.returnFailed(res, 400, "Gagal menghapus chat, tidak ada satu histori pun yang dapat di hilangkan!") })
    }
    catch (err) { callResult.returnFailed(res, 500, err.message) }
}

// GET CHAT HISTORY
exports.readLatestHistory = (req, res) => {
   const id = req.params.id
   try {
      chatModel.getLatestHistory(id)
      .then((result) => { callResult.returnSuccess(res, 200, result) })
      .catch((err) => { callResult.returnFailed(res, 400, err) })
   }
   catch (err) { callResult.returnFailed(res, 500, err.message) }
}
