/* $("#noun-request").on("click", function (event) {
  $.post("/api", { button: "noun" }, function (data) {
    if ($("p").html()) {
      $("p").remove();
      $(".form-answer").css("visibility", "hidden");
    } else {
      $(".form-2").after(`<p>${data}</p>`);
      $(".form-answer").css("visibility", "visible");
    }
  });
}); */

let inputId;
let letter;

$(".word-request").on("click", function (event) {
  $.post("/api", { button: event.target.id }, function (data) {
    if ($(".selected-word").html() || !data) {
      $(".selected-word").remove();
      $(".form-answer").css("visibility", "hidden");
      $(".option").addClass("hide");
      $("#options").css("visibility", "hidden");
      $(".special-char").attr("disabled", "true");
    } else {
      $(".game-buttons").after(`<p class="selected-word">${data}</p>`);
      if (
        data.includes("tüm") ||
        data.includes("öğrendin") ||
        data.includes("istediğin")
      ) {
        $(".form-answer").css("visibility", "hidden");
      } else {
        $("#answer").removeAttr("value");
        $(".form-answer").css("visibility", "visible");
        $("#options").css("visibility", "visible");
      }
    }
  });
});

$.get("/current-score", function (pCurrent) {
  $(".current-score").text(pCurrent);
});

$("#score").on("click", function () {
  $.get("/score", function (data) {
    $("#score").after(data);
  });
  $("#score").css("visibility", "hidden");
  $("#mainpage").css("visibility", "visible");
});

$.get("/record", function (data) {
  $(".record").text(data);
});

$.get("/learned", function (data) {
  $(".learned").text(data);
});

$("#typename").on("click", function () {
  if ($("#typename").is(":checked")) {
    $(".word-input").removeAttr("disabled");
    $(".non-name").attr("disabled", "true");
    $("#save-button").removeAttr("disabled");
    //$(".special-char").removeAttr("disabled");
    $.post("/type", { type: "noun" }, function (data, status) {
      console.log(status);
    });
  } else {
    $(".word-input").attr("disabled", "true");
    $(".non-name").removeAttr("disabled");
    $("#save-button").attr("disabled", "true");
    $(".special-char").attr("disabled", "true");
  }
});

$("#typeverb").on("click", function () {
  if ($("#typeverb").is(":checked")) {
    $(".common-input").removeAttr("disabled");
    $(".non-verb").attr("disabled", "true");
    $("#save-button").removeAttr("disabled");
    //  $(".special-char").removeAttr("disabled");
    $.post("/type", { type: "verb" }, function (data, status) {
      console.log(status);
    });
  } else {
    $(".common-input").attr("disabled", "true");
    $(".non-verb").removeAttr("disabled");
    $("#save-button").attr("disabled", "true");
    $(".special-char").attr("disabled", "true");
  }
});

$("#typeadjective").on("click", function () {
  if ($("#typeadjective").is(":checked")) {
    $(".common-input").removeAttr("disabled");
    $(".non-adjective").attr("disabled", "true");
    $("#save-button").removeAttr("disabled");
    $.post("/type", { type: "adjective" }, function (data, status) {
      console.log(status);
    });
  } else {
    $(".common-input").attr("disabled", "true");
    $(".non-adjective").removeAttr("disabled");
    $("#save-button").attr("disabled", "true");
    $(".special-char").attr("disabled", "true");
  }
});

/* $(".type-button").on("click", function () {
  $("#options").css("visibility", "visible");
}); */

$("#options").on("click", function () {
  $(".form-answer").addClass("visible");
  $("#options").css("visibility", "hidden");
  $(".option").removeClass("hide");
  $.get("/options", function (data, status) {
    $(".option-a").html(`<p><b>A:</b> ${data[0]}</p>`);
    $(".option-b").html(`<p><b>B:</b> ${data[1]}</p>`);
    $(".option-c").html(`<p><b>C:</b> ${data[2]}</p>`);
  });
});

$(".option").on("click", function (data) {
  let inputValue = data.target.innerText.split(":")[1];
  $("#answer").attr("value", inputValue.trim());
  if ($("#answer").val() === "") {
    $("#answer").replaceWith(`<input
    class="answer-translation"
    type="text"
    id="answer"
    name="answer"
    placeholder="Cevabı gir"
  />`);
    $("#answer").attr("value", inputValue.trim());
  }
});

$("#reset").on("click", function (data) {
  $.post("/reset", function () {
    if ($(".selected-word").html()) {
      $(".selected-word").remove();
      $(".form-answer").css("visibility", "hidden");
      $(".option").addClass("hide");
      $("#options").css("visibility", "hidden");
      $(".special-char").attr("disabled", "true");
    }
    $.get("/current-score", function (pCurrent) {
      $(".current-score").text(pCurrent);
    });
  });
});

$(".sp-char").on("focus", function (data) {
  inputId = data.currentTarget.id;
  $(".special-char").removeAttr("disabled");
});

/* $(".sp-char").on("blur", function (data) {
  $(".special-char").attr("disabled", "true");
}); */

$(".special-char").on("click", function (data) {
  letter = data.currentTarget.name;
  let currentText = $("#" + inputId).val();
  if (currentText !== "") {
    $("#" + inputId).val(currentText + letter);
    $("#" + inputId).trigger("focus");
  } else {
    $("#" + inputId).val(letter);
    $("#" + inputId).trigger("focus");
  }
});
