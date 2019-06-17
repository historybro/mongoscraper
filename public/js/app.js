$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<div class='card'>"
            + "<div class='card-body'>"
            + "<h5 class='card-title text-center'>"
            + data[i].title
            + "</h5><hr />"
            + "<div class='row'>"
            + "<div class='col-lg-4'>"
            + "<img class='artImg' src='"
            + data[i].image
            + "' alt='Card image'></div>"
            + "<div class='col-lg-8'><p class='card-text'>"
            + data[i].summary
            + "</p>"
            + "<div class='bdiv'>"
            + "<button type='button' class='btn btn-primary'><a href='"
            + data[i].link
            + "' target='_blank'><i class='fas fa-external-link-alt'></i></a></button>"
            + "<button type='button' class='btn btn-success' data-id='"
            + data[i]._id
            + "'><i class='far fa-sticky-note'></i></button>"
            + "</div></div></div></div></div>");
    }
});

$.getJSON("/prices", function (data) {
    for (var i = 0; i < data.length; i++) {
        $("#prices").append("<div class='carousel-item text-center'>"
            + "<p>"
            + "<span class='carTit'>"
            + data[i].title
            + "</span>"
            + "<span class='carPri'> "
            + data[i].price
            + "</span>"
            + "<span class='carCha'> "
            + data[i].change
            + " (24h)"
            + "</span>"
            + "</p></div>");
    }
});

$(document).on("click", ".btn-success", function () {
    $(".savedNote").empty();
    $("#titleinput").val("");
    $("#bodyinput").val("");
    var thisId = $(this).attr("data-id");
    $('#note').modal('show');
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            $("#cheat").text(data._id);
            $(".modal-title").text(data.title);
            console.log("reached here");
            if (data.note) {
                console.log(data.note);
                console.log(data.note.title);
                console.log(data.note.body);
                $("#savedNote").append("<div class='row'>"
                    + "<p>"
                    + data.note[i].title)
                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            };
        });
});

$(document).on("click", "#saveBtn", function () {
    var thisId = $("#cheat").text();
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
        .then(function (data) {
            console.log(data);
        });
    $("#titleinput").val("");
    $("#bodyinput").val("");
});

$(document).on("click", "#artbtn", function () {
    location.href = "/article";
});

$(document).on("click", "#pricebtn", function () {
    location.href = "/price";
});