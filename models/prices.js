var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PricesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    change: {
        type: Number,
        required: true
    }
});

var Prices = mongoose.model("Price", PricesSchema);

module.exports = Prices;