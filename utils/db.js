// this module contains the DBClient class that uses the mongo DBClient
import { MongoClient, ObjectId } from 'mongodb';
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
  async exists(email, id = null) {
    let user;
    if (id === null) {
      const body = {
        email,
      };
      user = await this.db.collection('users').findOne(body) || null;
    } else {
      const idObj = new ObjectId(id);
      user = await this.db.collection('users').findOne({ _id: idObj });
    }
    if (user === null) {
      return false;
    }
    return true;
  }

  // returns a particular user if exists in the database
  async getUser(email, id = null) {
    let user;
    if (id === null) {
      const body = {
        email,
      };
      user = await this.db.collection('users').findOne(body);
    } else {
      const idObj = new ObjectId(id);
      user = await this.db.collection('users').findOne({ _id: idObj });
    }
    return user;
  }

  // adds a new user to the db if
  async addUser(email, password) {
    const hashPwd = sha1(password).toString();
    const body = {
      email,
      password: hashPwd,
    };
    const user = await this.db.collection('users').insertOne(body);
    return user.ops[0];
  }

  // returns a particular user if exists in the database
  async getFile(id) {
    const idObj = new ObjectId(id);
    const file = await this.db.collection('files').findOne({ _id: idObj });
    return file;
  }

  // get files with a page and an id for the parent
  async getAll(user, parentId, newPage) {
    let query;
    let page = newPage;
    if (page === 0) {
      page += 1;
    }
    if (parentId === 0) {
      query = {
        parentId: 0,
        userId: user._id,
      };
    } else if (parentId === null) {
      query = { userId: user._id };
    } else {
      query = {
        parentId: new ObjectId(parentId),
        userId: user._id,
      };
    }
    const filesCollection = await this.db.collection('files');
    const files = filesCollection.find(query).skip(page - 1).limit(page + 20).toArray();
    return files;
  }

  // adds a new file to the db if
  async addFile(body) {
    const file = await this.db.collection('files').insertOne(body);
    return file.ops[0];
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
