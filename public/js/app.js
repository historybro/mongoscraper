$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<br /><div class='row article'>"
            + "<image class='col-lg-2' src='"
            + data[i].image + "'/>"
            + "<div class='col-lg-8'>"
            + "<h5 class='articleTitle'>"
            + data[i].title
            + "</h5><hr />"
            + "<p class='summary'>"
            + data[i].summary
            + "</p><br />"
            + "<button type='button' class='btn btn-primary'><a href='"
            + data[i].link
            + "' target='_blank'><i class='fas fa-external-link-alt'></i></a></button>"
            + "<button type='button' class='btn btn-success' data-id='"
            + data[i]._id
            + "'><i class='far fa-sticky-note'></i></button>"
            + "</div> </div>");
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
    location.href = "/scrapearticle";
});

$(document).on("click", "#pricebtn", function () {
    location.href = "/scrapeprice";
});