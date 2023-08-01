const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
let nounList = [];
let verbList = [];
let adjectiveList = [];
const tools = require("./public/tool");
let articles = new Map();
let correctcounts = new Map();
let defaultIndex;
let score = 0;
let recordData;
let availability;
let learnedCount;
let nonlearnedCount;
let newcount;
let wortDb;
let typeDb;
let nonlearned;
let nonlearnedVerb;
let nonlearnedNoun;
let nonlearnedAdjective;
let availabilityNoun;
let availabilityVerb;
let availabilityAdjective;
let wortList = [];
let optionlist = [];
let completed;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(
  "mongodb+srv://admin:Testtest123@studydecluster0.jiizfpn.mongodb.net/StudydeDB"
);
const nounSchema = new mongoose.Schema({
  wortart: String,
  artikel: String,
  wort: String,
  ubersetzung: String,
  istgelernt: Boolean,
  correctcount: Number,
});

const verbSchema = new mongoose.Schema({
  wortart: String,
  wort: String,
  ubersetzung: String,
  istgelernt: Boolean,
  correctcount: Number,
});

const adjectiveSchema = new mongoose.Schema({
  wortart: String,
  wort: String,
  ubersetzung: String,
  istgelernt: Boolean,
  correctcount: Number,
});

const scoreSchema = new mongoose.Schema({
  record: Number,
  isAvailable: Boolean,
});

const learnedSchema = new mongoose.Schema({
  learned: Number,
  isAvailable: Boolean,
});

const Noun = mongoose.model("Noun", nounSchema);
const Verb = mongoose.model("Verb", verbSchema);
const Adjective = mongoose.model("Adjective", adjectiveSchema);
const Score = mongoose.model("Score", scoreSchema);
const Learned = mongoose.model("Learned", learnedSchema);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/", function (req, res) {
  if (
    nounList.length === 0 &&
    verbList.length === 0 &&
    adjectiveList.length === 0 &&
    score !== 0
  ) {
    res.sendFile(__dirname + "/public/completed.html");
  } else {
    res.sendFile(__dirname + "/public/index.html");
  }
});

app.post("/type", function (req, res) {
  typeDb = req.body.type;
  res.sendStatus(200);
});

app.post("/new-word", function (req, res) {
  if (typeDb === "noun") {
    const noun = new Noun({
      wortart: "nomen",
      artikel: req.body.artikel,
      wort: req.body.newbox,
      ubersetzung: req.body.translation,
      istgelernt: false,
      correctcount: 0,
    });
    noun.save();
    availabilityNoun = true;
  }
  if (typeDb === "verb") {
    const verb = new Verb({
      wortart: "verb",
      wort: req.body.newbox,
      ubersetzung: req.body.translation,
      istgelernt: false,
      correctcount: 0,
    });
    verb.save();
    availabilityVerb = true;
  }
  if (typeDb === "adjective") {
    const adjective = new Adjective({
      wortart: "adjective",
      wort: req.body.newbox,
      ubersetzung: req.body.translation,
      istgelernt: false,
      correctcount: 0,
    });
    adjective.save();
    availabilityAdjective = true;
  }
  if (wortList.length !== 0 && score !== 0) {
    if (typeDb === "noun") {
      //wortList.push(req.body.newbox);
      articles.set(req.body.newbox, req.body.artikel);
    }
    wortList.push(req.body.newbox);
  }
  res.redirect("/");
});

app.post("/api", function (req, res) {
  switch (req.body.button) {
    case "noun-request":
      wortDb = Noun;
      wortList = nounList;
      availability = availabilityNoun;
      nonlearned = nonlearnedNoun;
      break;
    case "verb-request":
      wortDb = Verb;
      wortList = verbList;
      availability = availabilityVerb;
      nonlearned = nonlearnedVerb;
      break;
    case "adjective-request":
      wortDb = Adjective;
      wortList = adjectiveList;
      availability = availabilityAdjective;
      nonlearned = nonlearnedAdjective;
      break;
    default:
      console.log(`Sorry, "${req.body.button}" is not a valid button.`);
  }

  /* Score.find({}).then(function (data) {
    recordData = data;
  }); */

  if (
    nounList.length === 0 &&
    verbList.length === 0 &&
    adjectiveList.length === 0 &&
    score === 0
  ) {
    Noun.find({ istgelernt: false }).then(function (worts) {
      nonlearnedNoun = worts.length;
      nonlearnedCount = nonlearnedNoun;
      for (let data of worts) {
        articles.set(data.wort, data.artikel);
        correctcounts.set(data.wort, data.correctcount);
        nounList.push(data.wort);
        optionlist.push(data.ubersetzung);
      }
    });
    Noun.find({ istgelernt: true }).then(function (worts) {
      learnedCount = worts.length;
      for (let data of worts) {
        correctcounts.set(data.wort, data.correctcount);
      }
    });
    Verb.find({ istgelernt: false }).then(function (worts) {
      nonlearnedVerb = worts.length;
      nonlearnedCount += nonlearnedVerb;
      for (let data of worts) {
        correctcounts.set(data.wort, data.correctcount);
        verbList.push(data.wort);
        optionlist.push(data.ubersetzung);
      }
    });
    Verb.find({ istgelernt: true }).then(function (worts) {
      learnedCount += worts.length;
      for (let data of worts) {
        correctcounts.set(data.wort, data.correctcount);
      }
    });
    Adjective.find({ istgelernt: true }).then(function (worts) {
      learnedCount += worts.length;
      for (let data of worts) {
        correctcounts.set(data.wort, data.correctcount);
      }
    });
    Adjective.find({ istgelernt: false }).then(function (worts) {
      nonlearnedAdjective = worts.length;
      nonlearnedCount += nonlearnedAdjective;
      for (let data of worts) {
        correctcounts.set(data.wort, data.correctcount);
        adjectiveList.push(data.wort);
        optionlist.push(data.ubersetzung);
      }
      defaultIndex = Math.floor(Math.random() * wortList.length);
      /*       Score.find({}).then(function (data) {
        recordData = data;
      });
      console.log(recordData); */

      if (
        !recordData ||
        (nonlearned === 0 && availability !== true) ||
        (recordData.length === 0 && wortList.length === 0)
      ) {
        res.send("Öncelikle öğrenmek istediğin kelimeleri girmelisin!");
      } else if (wortList.length === 0 && availability === true) {
        completed = true;
        res.send("Bu kategorideki tüm kelimeleri öğrendin!");
      } else if (wortList === nounList) {
        res.write(articles.get(wortList[defaultIndex]) + " ");
        res.write(wortList[defaultIndex]);
        res.send();
      } else {
        res.send(wortList[defaultIndex]);
      }
    });
  } else {
    /* wortDb.find({}).then(function (data) {
      availabilityDb = data.length;
    }); */
    if (wortList.length === 0 && availability !== true && nonlearned === 0) {
      res.send("Öncelikle öğrenmek istediğin kelimeleri girmelisin!");
    } else if (wortList.length === 0 && completed !== true) {
      res.send(
        `"${
          req.body.button.split("-")[0]
        }" listesindeki tüm kelimeleri öğrendin. Diğer kategorilerden kelime seç.`
      );
    } else if (wortList.length === 0 && completed === true) {
      res.send("Bu kategorideki tüm kelimeleri öğrendin!");
    } else {
      defaultIndex = Math.floor(Math.random() * wortList.length);
      if (wortList === nounList) {
        res.write(articles.get(wortList[defaultIndex]) + " ");
        res.write(wortList[defaultIndex]);
        res.send();
      } else {
        res.send(wortList[defaultIndex]);
      }
    }
  }
});

app.post("/answer", function (req, res) {
  wortDb.find({ wort: wortList[defaultIndex] }).then(function (answerDb) {
    let answerInput = req.body.answer;
    if (answerInput.includes("I")) {
      answerInput = answerInput.replaceAll("I", "ı");
    }
    if (answerInput.toLowerCase() === answerDb[0].ubersetzung.toLowerCase()) {
      res.sendFile(__dirname + "/public/correct.html");
      score += 5;
      newcount = correctcounts.get(wortList[defaultIndex]) + 1;
      wortDb
        .findOneAndUpdate(
          { wort: wortList[defaultIndex] },
          { correctcount: newcount }
        )
        .then(function () {
          console.log("Updated successfully");
        });
      if (newcount > 2) {
        wortDb
          .findOneAndUpdate(
            { wort: wortList[defaultIndex] },
            { istgelernt: true }
          )
          .then(function () {
            learnedCount += 1;
            console.log("Updated successfully 2");
          });
        Learned.findOneAndUpdate(
          { isAvailable: true },
          { learned: learnedCount + 1 }
        ).then(function () {
          console.log("Learn updated succesfully");
        });
      }
      wortList.splice(defaultIndex, 1);
    } else {
      res.sendFile(__dirname + "/public/wrong.html");
      score -= 3;
      newcount = correctcounts.get(wortList[defaultIndex]) - 1;
      if (newcount < 0) {
        correctcounts.set(wortList[defaultIndex], 0);
        newcount = 0;
      } else {
        correctcounts.set(wortList[defaultIndex], newcount);
      }
      wortDb
        .findOneAndUpdate(
          { wort: wortList[defaultIndex] },
          { correctcount: newcount }
        )
        .then(function () {
          console.log("Updated successfully f");
        });
    }
    Score.find({}).then(function (data) {
      recordData = data;
    });
  });
});

app.get("/options", function (req, res) {
  wortDb.find({ wort: wortList[defaultIndex] }).then(function (answerDb) {
    let answer = answerDb[0].ubersetzung;
    optionlist.splice(optionlist.indexOf(answer), 1);
    let IdOption1 = Math.floor(Math.random() * optionlist.length);
    let option1 = optionlist[IdOption1];
    optionlist.splice(IdOption1, 1);
    let IdOption2 = Math.floor(Math.random() * optionlist.length);
    let option2 = optionlist[IdOption2];
    let option3 = answer;
    optionlist.push(option1, answer);
    const options = [option1, option2, option3];
    let orderOption1 = Math.floor(Math.random() * options.length);
    let optA = options[orderOption1];
    options.splice(orderOption1, 1);
    let orderOption2 = Math.floor(Math.random() * options.length);
    let optB = options[orderOption2];
    options.splice(orderOption2, 1);
    let optC = options[0];
    score -= 2;
    res.send([optA, optB, optC]);
  });
});

app.get("/current-score", function (req, res) {
  res.send(`Puanın: ${score}`);
});

app.get("/score", function (req, res) {
  Score.find({ isAvailable: true }).then(function (highest) {
    if (highest.length === 0) {
      const recordScore = new Score({
        record: score,
        isAvailable: true,
      });
      recordScore.save();
      res.send(
        `<p>Bu senin ilk rekorun. Tebrikler KÜBRA!!!! ${score} puan topladın!</p>`
      );
      score = 0;
    } else if (highest[0].record < score) {
      Score.findOneAndUpdate({}, { record: score }).then(function () {
        res.send(`<p>Rekorunu kırdın!!! Yeni rekorun ${score}</p>`);
        score = 0;
      });
    } else {
      res.send(`<p>Puanın ${score}</p>`);
      score = 0;
    }
  });
});

app.get("/record", function (req, res) {
  Score.find({ isAvailable: true }).then(function (highest) {
    if (highest.length === 0) {
      res.send(`Rekor: 0`);
    } else {
      res.send(`Rekor: ${highest[0].record}`);
    }
  });
});

app.get("/learned", function (req, res) {
  Learned.find({ isAvailable: true }).then(function (pLearned) {
    if (pLearned.length === 0) {
      const learnedData = new Learned({
        learned: learnedCount,
        isAvailable: true,
      });
      learnedData.save();
      if (!learnedCount) {
        learnedCount = 0;
      }
      res.send(`Öğrendiğin Kelime: ${learnedCount}`);
    } else {
      if (!pLearned[0].learned) {
        res.send(`Öğrendiğin Kelime: 0`);
      } else {
        res.send(`Öğrendiğin Kelime: ${pLearned[0].learned}`);
      }
    }
  });
});

app.post("/reset", function (req, res) {
  nounList = [];
  verbList = [];
  adjectiveList = [];
  wortList = [];
  score = 0;
  articles.clear();
  correctcounts.clear();
  res.redirect("/");
});

app.listen("3000", function () {
  console.log("The server has been started from the port 3000");
});
