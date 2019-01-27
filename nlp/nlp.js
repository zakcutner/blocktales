// use this one!
async function validWord(sentenceSoFar, word) {
    sentenceSoFar = sentenceSoFar.split(" ");
    let nice = !wordIsNaughty(word);
    let spelledCorrectly = await wordIsSpelledCorrectly(word);
    let heuristicallyCorrect = passesGrammarHeuristics(sentenceSoFar, word);
    return nice && spelledCorrectly && heuristicallyCorrect;
}


function wordIsNaughty(word) {
    return naughtyList.includes(word);
}

// returns promise
// idea: if word is spelled correctly, then at least some word will have a similar meaning
async function wordIsSpelledCorrectly(word) {

    let whitelist = ["."];
    if (whitelist.includes(word)) {
        return true;
    }

    let baseURL = "https://api.datamuse.com/words?ml=";
    let suffix = "&max=1";
    let joinedURL = baseURL + word + suffix;

    try {
        let result = await fetch(joinedURL);
        let parsedResult = await result.json();
        console.log(parsedResult);
        return parsedResult.length != 0;
    }
    catch (err) {
        throw err;
    }
}

function passesGrammarHeuristics(sentenceSoFar, newWord) {
    let lastWord = sentenceSoFar[sentenceSoFar.length - 1];
    let repeatsWord = lastWord === newWord;

    let wholeSentence = sentenceSoFar.concat([newWord]);
    let holisticallyCorrect = newWord === "." ? passesHolisticHeuristics(wholeSentence) : true;

    return !repeatsWord && holisticallyCorrect;
}

function passesHolisticHeuristics(sentence) {
    let lastWord = sentence[sentence.length - 2]; // very last word is actually "."
    let prepositions = ["a", "an", "the"];
    let endsInPreposition = prepositions.includes(lastWord);

    return !endsInPreposition;
}

// validWord("Once upon a time the", ".").then(result => console.log(result));
