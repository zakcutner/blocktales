// use this one!
function validWord(sentenceSoFar, word) {
    return !wordIsNaughty(word);
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
        const result = await fetch(joinedURL);
        const parsedResult = await result.json();
        return parsedResult.length != 0;
    }
    catch (err) {
        throw err;
    }
}

console.log(wordIsSpelledCorrectly("imperial").then(result => console.log(result)));
