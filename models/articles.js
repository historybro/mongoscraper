var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true 
    },
    link: {
        type: String,
        
    },
    image: {
        type: String
    },
    summary: {
        type: String
    },
    note: {
        type: [{
                type: Schema.Types.ObjectId, 
                ref: 'Note'
        }]
    }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;