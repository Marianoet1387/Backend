const mongoose = require("mongoose")
const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                prodId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
});
cartSchema.virtual("id").get(function () {
    return this._id.toString()
})

module.exports = mongoose.model("Cart", cartSchema, "carts")