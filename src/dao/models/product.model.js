const mongoose = require("mongoose")
const schema = new mongoose.Schema({
    title: {
        type: String,
        required:true,
    },
    description:{
        type:String,
        required: true
    },
    price: {
        type: Number,
        required:true
    },
    thumbnail:{
        type:String,
        required: true,
    },
    code:{
        type:String,
        required: true,
    },
    stock:{
        type: Number,
        required:true
    },
    // role:{
    //     type:String,
    //     required: true,
    //     default: "user" // Por defuolt, sin ponerle ningun valor, se pone el dato user.
    // }

})
schema.virtual("id").get(function () {
    return this._id.toString()
})

module.exports = mongoose.model("Product",schema,"products")