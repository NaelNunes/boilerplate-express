let express = require('express');
let app = express();
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

console.log("Hello World");

app.use(bodyParser.urlencoded({ extended: false }));

// Middleware de log
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Servindo arquivos estáticos
app.use('/public', express.static(__dirname + '/public'));

// Rota inicial
app.get("/", (req, res) => {
  const arquivo = path.join(__dirname, 'views/index.html');
  res.sendFile(arquivo);
});

// Rota /json
app.get("/json", (req, res) => {
  let message = "Hello json";
  if (process.env.MESSAGE_STYLE === 'uppercase') {
    message = message.toUpperCase();
  }
  res.json({ message });
});

// Rota /now com middleware encadeado
app.get("/now", (req, res, next) => {
  req.time = new Date().toString();
  next();
}, (req, res) => {
  res.json({ time: req.time });
});

app.get("/:word/echo", (req,res) => {

  let word = req.params.word;
  return res.json( { echo: word } )
});

app.get("/name", (req,res) => {
  let first = req.query.first;
  let last = req.query.last;

  return res.json({ name: `${first} ${last}` });

});

app.post("/name", (req,res) => {
  let first = req.body.first;
  let last = req.body.last; 

  return res.json({ name: `${first} ${last}` });
});

module.exports = app;
