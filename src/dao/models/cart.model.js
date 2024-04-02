const mongoose = require("mongoose")
const cartSchema = new mongoose.Schema({
    products: [
        {
            prodId: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
});
cartSchema.virtual("id").get(function () {
    return this._id.toString()
})

module.exports = mongoose.model("Cart", cartSchema, "carts")