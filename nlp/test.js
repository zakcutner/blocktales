var validWord = require("./index").validWord;

// Valid sentence
validWord("Once upon a time there was a", "hackathon.").then(result =>
  result === true ? console.log("PASS") : console.log("FAIL")
);
// Expect: true

// Repetition
validWord("Once upon a time there was", "was").then(result =>
  result === false ? console.log("PASS") : console.log("FAIL")
);
// Expect: false

// Extra whitespace, with repetition
validWord("Once upon a time there was ", "was").then(result =>
  result === false ? console.log("PASS") : console.log("FAIL")
);
// Expect: false

// Sentence terminating with preposition
validWord("Once upon a time there was", "a.").then(result =>
  result === false ? console.log("PASS") : console.log("FAIL")
);
// Expect: false

// Sentence terminating with preposition, separate full stop
validWord("Once upon a time there was a", ".").then(result =>
  result === false ? console.log("PASS") : console.log("FAIL")
);
// Expect: false

// Profanity
validWord("Once upon a", "ruski").then(result =>
  result === false ? console.log("PASS") : console.log("FAIL")
);
// Expect: false

// Miss-spelling
validWord("Once upon a", "tiem").then(result =>
  result === false ? console.log("PASS") : console.log("FAIL")
);
// Expect: false

// Space
validWord("Once upon a", "time there").then(result =>
  result === false ? console.log("PASS") : console.log("FAIL")
);
// Expect: false

// Getting last sentence
getLastSentence("Once upon. A time there was. Some dude") == "Some dude"
  ? console.log("PASS")
  : console.log("FAIL");
// Expect: "Some dude"
