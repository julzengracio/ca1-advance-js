const express = require('express');
const bodyparser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();

// serve files from public folder directory
app.use(express.static('public'));

// parsers
app.use(bodyparser.json());

// connect to database
let db;

// score defaults
let highScore = 0;
let scoreData;
let nameData;
let score = 0;

// replace url below with your own MongoDb url
const url = 'mongodb://@localhost:27017/highScore';

// connect to the database
MongoClient.connect(url, (err, database) => {
    if(err){
        return console.log(err);
    }
    db = database;
    app.listen(7070, () => {
        console.log('Listening on port 7070')
    });
});

// store the score in the database if it's greater than the high score
app.put('/clicked', (req, res) => {
    score++;
    //scoreData = {'Highscore': highScore};
    scoreData = JSON.stringify(req.body);
    scoreNumData = JSON.stringify(req.body.score);
    console.log('Data recieved: ' + scoreData);
    
    if(scoreNumData >= highScore) {
        highScore++;
        db.collection('scores').update({}, req.body, {upsert: true}, (err, result) => {
            if(err) {
                return console.log(err);
            }
            console.log(`New high score: ${highScore}`);
            res.sendStatus(201);
        });
    } else {
        res.sendStatus(201);
    }
    
});

// get the highscore from database
app.get('/showScore', (req, res) => {
    db.collection('scores').findOne({}, (err, result) => {
        if(err) return console.log(err);
        if(!result) return res.send({score});
        res.send(result);
    });
});

// get the input name
app.post('/checkName', (req, res) => {
    nameData = JSON.stringify(req.body.name);
    console.log(`Player Name: ${nameData}`);
    db.collection('names').update({}, req.body, {upsert: true}, (err, result) => {
        if(err) {
            return console.log(err);
        } else {
            res.sendStatus(201);
        }
    });
});

// pass the name stored in the database to the client
app.get('/showName', (req, res) => {
    db.collection('names').findOne({}, (err, result) => {
        if(err) return console.log(err);
        if(!result) return res.send({nameData});
        res.send(result);
    });
});

// serve the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// serve the game page
app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/public/game.html');
});