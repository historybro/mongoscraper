var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var PriceSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: String,
    },
    change: {
        type: String,
    }
});
var Price = mongoose.model("Price", PriceSchema);
module.exports = Price;