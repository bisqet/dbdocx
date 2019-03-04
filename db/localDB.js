const
  path = require('path'),
  fs = require('fs'),
  db = {},
  pathToDb = path.join(__dirname, 'db.json');

db.createConnection = (prefix) => {
  try {
    fs.statSync(pathToDb);
    fs.appendFileSync('.out.log', `\n successfully connected to DB with prefix: ${prefix}`)
    console.debug(`successfully connected to DB with prefix: ${prefix}`);
  } catch (err) {
    if (err.code == 'ENOENT') {
      fs.openSync(pathToDb, 'w');
      fs.appendFileSync(pathToDb, '{}');
      fs.appendFileSync('.out.log', '\n db.json was created');
      console.debug('successfully added db.json');
    } else {
      fs.appendFileSync('.err.log', `\n Unknown error in db.createConnection, error code: ${err.code}`);
      console.error('Unknown error in db.createConnection, error code:', err.code);
    }
  }
};

db.addObject = async (o, prefix) => {
  let data = await db.getAll();
  if (!data[prefix]) data[prefix] = [];
  data[prefix].push(o);
  //let csvdata = [];
  for (let i in data) {
    for (let o in data[i]) {
      let temp = {};
      temp.prefix = i;
      temp['hasMobility'] = data[i][o].hasMobility === 1 ? "Yes" : "No";
      temp['maxSpeed'] = data[i][o].maxSpeed;
      temp['ZIP'] = data[i][o].zip;
      temp['Address'] = data[i][o].address;
      //csvdata.push(temp)
    }
  }
  data = JSON.stringify(data);
  fs.writeFile(pathToDb, `${data}`, (err) => {
    if (err) {
      console.error('Error while adding new object to DB!!!')
      return fs.appendFileSync('.err.log', `\n Unknown error in db.addObject, error code: ${err.code}`);
    }
    return console.debug('successfully added new object to DB')
  });
};

db.getAll = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(pathToDb, 'utf8', (err, res) => {
      if (err) {
        console.error('Error while getting DB!!!');
        fs.appendFileSync('.err.log', `\n Unknown error in db.getAll, error code: ${err.code}`);
        return reject(err);
      }
      return resolve(JSON.parse(res));
    });
  })
};

module.exports = db;