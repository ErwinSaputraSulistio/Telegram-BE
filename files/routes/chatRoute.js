const express = require("express")
const route = express.Router()
const chatController = require("../controllers/chatController")
const jwtCheck = require("../functions/JWT")

route
   .post("/", chatController.createChatConnection)
   .get("/:id", chatController.readChatConnectionByUserId)
   .post("/backup", chatController.backupChat)
   .get("/history/:id", chatController.readChatHistory)
   .get("/latest/:id", chatController.readLatestHistory)
   .delete("/history/:id", chatController.deleteChatHistory)
   .delete("/connection/:id", chatController.removeFriend)

module.exports = route