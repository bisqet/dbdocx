const
  path = require('path'),
  fs = require('fs'),
  db = {},
  pathToDb = path.join(__dirname, 'db.json');
let lastChange = 0;
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
db.replaceDb = async (db) => {
  lastChange++;
  let data = {db, lastChange};
  fs.writeFile(pathToDb, `${data}`, (err) => {
    if (err) {
      console.error('Error while replacing DB!!!');
      return fs.appendFileSync('.err.log', `\n Unknown error in db.addObject, error code: ${err.code}`);
    }
    return console.debug('successfully replaced DB')
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
db.checkForUpdates = (lastChangeReq) =>{
  if(lastChangeReq<lastChange){
    return {status:"Local store is behind master store by"+lastChange-lastChangeReq+" changes"};
  }
  return {status:"OK"}
}

module.exports = db;