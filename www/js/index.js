require("../scss/index.scss");

var chain = require("chain");

var client = new chain.Client(add, loadLedger);

var xss = require("xss");
$("input").focus();

function loadLedger(data) {
  $("#ledger").text(data);
}

function resizeInput() {
  if ($("#textEntry").val().length == 0) $(".entry .border").css("width", "");
  else
    $(".entry .border").css(
      "width",
      $("#textEntry").val().length * 1.2 + 2 + "em"
    );
}

function validWord() {
  return true;
}

function verify(text) {
  return validWord(
    $("#ledger")
      .text()
      .substring(0, $("#ledger").text().length - 3),
    text
  );
}

addSuggestion("builder");

function add(text) {
  $("#textEntry").removeAttr("disabled");
  $("#textEntry").val("");
  resizeInput();
  clearSuggestions();
  $(".notification").removeClass("show");
  $("input").focus();
  erase(3);
  if (text != ".") write(" " + text + "... ", -2);
  else write(text + "... ", -1);
  // TODO: GET NEW WORDS FROM BLOCKCHAIN
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
  var text = xss($("#textEntry").val());
  if (verify(text)) {
    $(".notification").addClass("show");
    $("#textEntry").attr("disabled", "disabled");
    client.mineWord(text);
  } else {
    $("#textEntry").val("");
  }
});

$(document).dblclick(function() {
  var msg = new SpeechSynthesisUtterance($("p").text());
  window.speechSynthesis.speak(msg);
});
