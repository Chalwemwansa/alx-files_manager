// this module contains the DBClient class that uses the mongo DBClient
import { MongoClient } from 'mongodb';
import sha1 from 'sha1';

// get the variables from the environment variables
const host = process.env.DB_HOST || '127.0.0.1';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}`;

class DBClient {
  constructor() {
    this.client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    (async () => {
      await this.client.connect();
    })();
    this.db = this.client.db(database);
  }

  // the isAlive function that checks if the database is connected
  isAlive() {
    return this.client.isConnected();
  }

  // method nbUsers that returns the number of documents in the users collection
  async nbUsers() {
    const num = await this.db.collection('users').countDocuments();
    return num;
  }

  // method nbFiles that returns the number of files in the colection ndFiles
  async nbFiles() {
    const num = await this.db.collection('files').countDocuments();
    return num;
  }

  // checks if a particular email exists in the database
  async exists(email) {
    const user = await this.db.collection('users').findOne({email,}) || null;
    if (user === null) {
      return false;
    } else {
      return true;
    }
  }

  // adds a new user to the db if
  async addUser(email, password) {
    const hashPwd = sha1(password);
    const user = await this.db.collection('users').insertOne({email, password: hashPwd});
    console.log(user);
    return user.ops[0];
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
