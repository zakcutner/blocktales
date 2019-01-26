require("../scss/index.scss");
var xss = require("xss");

function resizeInput() {
  $(this).attr("size", $(this).val().length);
}

function verify(text) {
  //TODO VERIFY TEXT
  return true;
}

add("house");

function add(text) {
  erase(3);
  write(" " + text + "... ", -2);
  //TODO GET NEW WORDS FROM BLOCKCHAIN
}

function write(text, i) {
  if (i <= text.length) {
    $("#ledger").text($("#ledger").text() + text.charAt(i++));
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

$(".suggestions span").click(function() {
  var text = xss($(this).text());
  console.log(text);
  $("#textEntry").val(text);
});

$("#textEntry")
  .keyup(resizeInput)
  .each(resizeInput);

$("#textForm").submit(function(e) {
  e.preventDefault();
  var text = $("#textEntry").val();
  if (verify(text)) {
    $("#textEntry").attr("disabled", "disabled");
    //TODO ADD TO BLOCKCHAIN
    $("#textEntry").removeAttr("disabled");
    $("#textEntry").val("");
    add(text);
  } else {
    $("#textEntry").val("");
  }
});
