var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = 3000;
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://heroku_0tlnpxgc:testing123@ds133187.mlab.com:33187/heroku_0tlnpxgc" || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

app.get("/scrape", function (req, res) {
  axios.get("https://www.coindesk.com/").then(function (response) {
    var $ = cheerio.load(response.data);

    $(".stream-article").each(function (i, element) {
      var article = {};
      
      article.title = $(this)
      .attr("title");
      article.link = $(this)
      .attr("href");
      article.image = $(this)
        .children(".image")
        .children("img")
        .attr("src");
      article.summary = $(this)
      .children(".meta")
        .children("p")
        .text();               
        db.Article.create(article)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
      });

    // $(".sidebar-price-widget-v2-list-item").each(function (i, element) {
    //   var price = {};
    //   price.title = $(this)
    //     .children(".sidebar-price-widget-v2-list-item__meta")
    //     .children(".sidebar-price-widget-v2-list-item__name")
    //     .text();
    //   price.price = $(this)
    //     .children(".sidebar-price-widget-v2-list-item__data")
    //     .children(".sidebar-price-widget-v2-list-item__price")
    //     .text();
    //   price.change = $(this)
    //     .children(".sidebar-price-widget-v2-list-item__data")
    //     .children(".sidebar-price-widget-v2-list-item__percent sidebar-price-widget-v2-list-item__text--down")
    //     .text();
    //   db.Price.create(price)
    //   .then(function (dbArticle) {
    //     console.log(dbArticle);
    //   })
    //   .catch(function (err) {
    //     console.log(err);
    //   });
    // });

    res.send("scrape complete");
  });
});

app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/prices", function (req, res) {
  db.Price.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/articles/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    })
});

app.post("/articles/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id },
        { note: dbNote._id },
        { new: true });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});