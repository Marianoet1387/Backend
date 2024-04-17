const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")
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
})
schema.plugin(mongoosePaginate);

schema.virtual("id").get(function () {
    return this._id.toString()
})

module.exports = mongoose.model("Product",schema,"products");