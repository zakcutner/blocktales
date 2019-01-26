var naughtyList = [];
fetch('/nlp/block-list-parsed.txt')
    .then(response => response.text())
    .then(text => populateNaughtyList(text.split("\n")))
    .then(main)

function populateNaughtyList(words) {
    words.map(word => naughtyList.push(word));
}

function wordIsNaughty(word) {
    console.log(naughtyList);

    console.log("INPUT TEXT:");
    var ruskiStr = naughtyList[885];
    console.log(typeof ruskiStr);
    for (var i = 0; i < ruskiStr.length; i++) {
        console.log(ruskiStr.charChodeAt(i));
    }
    console.log(naughtyList[885] == "ruski");
}

function main() {
    console.log(wordIsNaughty("ruski"));
}
