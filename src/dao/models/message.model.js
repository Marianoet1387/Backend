const mongoose = require("mongoose")
const messageSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    message: {
        type: String
    }
})
module.exports = mongoose.model("Messages", messageSchema, "messages")