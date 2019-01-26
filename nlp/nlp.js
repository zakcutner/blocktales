// use this one!
async function validWord(sentenceSoFar, word) {
    let nice = !wordIsNaughty(word);
    let spelledCorrectly = await wordIsSpelledCorrectly(word);
    return nice && spelledCorrectly;
}


function wordIsNaughty(word) {
    return naughtyList.includes(word);
}

// returns promise
// idea: if word is spelled correctly, then at least some word will have a similar meaning
async function wordIsSpelledCorrectly(word) {
    let baseURL = "https://api.datamuse.com/words?ml=";
    let suffix = "&max=1";
    let joinedURL = baseURL + word + suffix;
    console.log("URL used: " + joinedURL);

    try {
        let result = await fetch(joinedURL);
        let parsedResult = await result.json();
        return parsedResult.length != 0;
    }
    catch (err) {
        throw err;
    }
}

console.log(validWord("Once upon a time", "imperial").then(result => console.log(result)));
