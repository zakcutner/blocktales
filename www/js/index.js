require("../scss/index.scss");
var xss = require("xss");

function resizeInput() {
  if ($("#textEntry").val().length == 0) $(".entry").css("width", "");
  else $(".entry").css("width", $("#textEntry").val().length * 1.2 + 2 + "em");
}

function verify(text) {
  //TODO VERIFY TEXT
  return true;
}

add("house");
addSuggestion("builder");

function add(text) {
  erase(3);
  if (text != ".") write(" " + text + "... ", -2);
  else write(text + "... ", -1);
  //TODO GET NEW WORDS FROM BLOCKCHAIN
}

function write(text, i) {
  if (i <= text.length) {
    $("#ledger").append(text.charAt(i++));
    setTimeout(write, 100, text, i);
  }
}

function erase(i) {
  $("#ledger").text(
    $("#ledger")
      .text()
      .trim()
  );
  if (i-- > 0) {
    $("#ledger").text(
      $("#ledger")
        .text()
        .substring(0, $("#ledger").text().length - 1)
    );
    setTimeout(erase, 1, i);
  }
}

setTimeout(function() {
  addSuggestion("hello");
}, 5000);

function addSuggestion(text) {
  $("#suggestionList").prepend("<li>" + xss(text) + "</li>\n");
}

function clearSuggestions() {
  $("#suggestionList").addClass("hide");
  setTimeout(function() {
    $("#suggestion").html(
      "<h2>What other people are thinking...</h2><ul id='suggestionList'></ul>"
    );
  }, 750);
}

$(document).on("click", ".suggestion li", function() {
  var text = xss($(this).text());
  console.log(text);
  $("#textEntry").val(text);
  resizeInput();
  $("#textForm").submit();
});

$("#textEntry").keyup(resizeInput);

$("#textForm").submit(function(e) {
  e.preventDefault();
  var text = $("#textEntry").val();
  if (verify(text)) {
    $(".notification").addClass("show");
    $("#textEntry").attr("disabled", "disabled");
    //TODO ADD TO BLOCKCHAIN
    $("#textEntry").removeAttr("disabled");
    $("#textEntry").val("");
    resizeInput();
    add(text);
    clearSuggestions();
    $(".notification").removeClass("show");
  } else {
    $("#textEntry").val("");
  }
});

var msg = new SpeechSynthesisUtterance($("p").text());

$(document).dblclick(function() {
  window.speechSynthesis.speak(msg);
});
