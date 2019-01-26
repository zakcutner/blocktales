// use this one!
function validWord(sentenceSoFar, word) {
    return !wordIsNaughty(word);
}


function wordIsNaughty(word) {
    return naughtyList.includes(word);
}
