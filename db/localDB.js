const
  path = require('path'),
  fs = require('fs'),
  db = {},
  pathToDb = path.join(__dirname, 'db.json');
  db.createConnection = (prefix) => {
  try {
    fs.statSync(pathToDb);
    fs.appendFileSync('.out.log', `\n successfully connected to DB with prefix: ${prefix}`)

  } catch (err) {
    if (err.code == 'ENOENT') {
      fs.openSync(pathToDb, 'w');
      fs.appendFileSync(pathToDb, '{}');
      fs.appendFileSync('.out.log', '\n db.json was created');

    } else {
      fs.appendFileSync('.err.log', `\n Unknown error in db.createConnection, error code: ${err.code}`);
      console.error('Unknown error in db.createConnection, error code:', err.code);
    }
  }
};
db.replaceDb = async (users) => {
  let data = JSON.stringify(users);
  fs.writeFile(pathToDb, `${data}`, (err) => {
    if (err) {
      console.error('Error while replacing DB!!!');
      return fs.appendFileSync('.err.log', `\n Unknown error in db.addObject, error code: ${err.code}`);
    }
    return ;
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
      res = JSON.parse(res);
      return resolve(res);
    });
  })
};
db.checkForUpdates = async (state) =>{
  let stringifiedState = JSON.stringify(state);
  const currentDbState = await db.getAll();
  if(stringifiedState!==JSON.stringify(currentDbState)&&Object.keys(currentDbState).length!==0){
    return {status:"Local store unsync with master"};
  }
  return {status:"OK"}
}

module.exports = db;