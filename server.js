var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = process.env.PORT || 3000;
var app = express();
var calls = ("./controller/calls");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/article", function (req, res) {
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
    res.redirect("/");
  });
});

app.get("/price", function (req, res) {
  axios.get("https://coinmarketcap.com/").then(function (response) {
    var $ = cheerio.load(response.data);
    $("tr").each(function (i, element) {
      var crypto = {};
      crypto.title = $(element)
        .find(".currency-name-container")
        .text();
      crypto.price = $(element)
        .find(".price")
        .text();
      crypto.change = $(element)
        .find(".percent-change")
        .text();
      db.Price.create(crypto)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
      return i < 5;
    });
    res.redirect("/");
  });
});

app.get("/articles", function (req, res) {
  db.Article.find({})
    .sort({_id: -1})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/prices", function (req, res) {
  db.Price.find({})
    .then(function (dbPrice) {
      res.json(dbPrice);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/notes", function (req, res) {
  db.Note.find({})
    .then(function (dbNote) {
      res.json(dbNote);
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

app.post("/notes/:id", function (req, res) {
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

app.delete("/notes/:id", function (req, res) {
  db.Note.findByIdAndRemove({ _id: req.params.id })
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id },
        { note: dbNote._id });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
  console.log("http://localhost:" + PORT);
});