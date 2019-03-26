// server.js
// where your node app starts

// init project
const createReport = require('docx-templates').default;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./db/localBD.js');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.post('/syncUsersDB', async function (request, response) {
  await db.replaceDb(request.body);
  response.end('Синхронизация успешна.');
  console.log(request.body);
});

app.get('/connectToDb', function (request, response) {
  db.createConnection();
  response.end('successful');
  console.log(request);
});
app.get('/checkForUpdates', function (request, response) {
  response.end(db.checkForUpdates(JSON.stringify(request.body.lastChange)));
  console.log(request);
});

app.get('/getAll', async function (request, response) {
  response.end(JSON.stringify(await db.getAll()));
  console.log(request);
});

app.post('/formJournal', async function (request, response) {
  console.log(request.body);
  const data = await createReport({
    template: 'templates/journal-template.docx',
    output: 'buffer',
    data: request.body,
  });
  response.end(data, 'binary');
});
app.post('/formDopusk', async function (request, response) {
  console.log(request.body);
  const data = await createReport({
    template: 'templates/dopusk.docx',
    output: 'buffer',
    data: request.body,
  });
  response.end(data, 'binary');
});
app.post('/formPednagr', async function (request, response) {
  console.log(request.body);
  const data = await createReport({
    template: 'templates/pednagruzka.docx',
    output: 'buffer',
    data: request.body,
  });
  response.end(data, 'binary');
});
app.post('/formOtchisl', async function (request, response) {
  console.log(request.body);
  const data = await createReport({
    template: 'templates/Otchislenie.docx',
    output: 'buffer',
    data: request.body,
  });
  response.end(data, 'binary');
});
app.post('/formZachisl', async function (request, response) {
  console.log(request.body);
  const data = await createReport({
    template: 'templates/prikazOZachislenii.docx',
    output: 'buffer',
    data: request.body,
  });
  response.end(data, 'binary');
});
app.post('/formListSlush', async function (request, response) {
  console.log(request.body);
  const data = await createReport({
    template: 'templates/listSlush.docx',
    output: 'buffer',
    data: request.body,
  });
  response.end(data, 'binary');
});
app.post('/formDiarys', async function (request, response) {
  console.log(request.body);
  const data = await createReport({
    template: 'templates/diarys.docx',
    output: 'buffer',
    data: request.body,
  });
  response.end(data, 'binary');
});
app.post('/formexamvedomost', async function (request, response) {
  console.log(request.body);
  const data = await createReport({
    template: 'templates/examvedomost.docx',
    output: 'buffer',
    data: request.body,
  });
  response.end(data, 'binary');
});
app.post('/journalUsp', async function (request, response) {
  console.log(request.body);
  const data = await createReport({
    template: 'templates/journalUsp.docx',
    output: 'buffer',
    data: request.body,
  });
  response.end(data, 'binary');
});
app.post('/formkvalicomission', async function (request, response) {
  console.log(request.body);
  const data = await createReport({
    template: 'templates/kvalicomission.docx',
    output: 'buffer',
    data: request.body,
  });
  response.end(data, 'binary');
});
app.post('/formstartEdu', async function (request, response) {
  console.log(request.body);
  const data = await createReport({
    template: 'templates/startEdu.docx',
    output: 'buffer',
    data: request.body,
  });
  response.end(data, 'binary');
});
app.post('/formVipuskGrupi', async function (request, response) {
  console.log(request.body);
  const data = await createReport({
    template: 'templates/vipuskGrupi.docx',
    output: 'buffer',
    data: request.body,
  });
  response.end(data, 'binary');
});


// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
