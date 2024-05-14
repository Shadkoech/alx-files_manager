// const { MongoClient } = require('mongodb');
// const { ObjectId } = require('mongodb');

// class DBClient {
//   constructor() {
//     const host = process.env.DB_HOST || 'localhost';
//     const port = process.env.DB_PORT || 27017;
//     const database = process.env.DB_DATABASE || 'files_manager';

//     this.client = new MongoClient(`mongodb://${host}:${port}/${database}`, { useUnifiedTopology: true });

//     this.client.connect((err) => {
//       if (err) {
//         console.error(`DB connection error: ${err}`);
//       } else {
//         console.log('DB connected');
//       }
//     });
//   }

//   isAlive() {
//     return this.client.isConnected();
//   }

//   async nbUsers() {
//     const db = this.client.db();
//     const collection = db.collection('users');
//     const count = await collection.countDocuments();
//     return count;
//   }

//   async nbFiles() {
//     const db = this.client.db();
//     const collection = db.collection('files');
//     const count = await collection.countDocuments();
//     return count;
//   }

//   async getUserByEmail(email) {
//     const db = this.client.db();
//     const collection = db.collection('users');
//     return collection.findOne({ email });
//   }

//   async insertUser(user) {
//     const db = this.client.db();
//     const collection = db.collection('users');
//     const result = await collection.insertOne(user);
//     return result.ops[0];
//   }

//   async getUserByEmailAndPassword(email, password) {
//     const db = this.client.db();
//     const collection = db.collection('users');
//     return collection.findOne({ email, password });
//   }

//   async getUserById(id) {
//     const db = this.client.db();
//     const collection = db.collection('users');
//     return collection.findOne({ _id: new ObjectId(id) });
//   }
// }

// const dbClient = new DBClient();

// module.exports = dbClient;


const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    this.client = new MongoClient(`mongodb://${host}:${port}/${database}`, { useUnifiedTopology: true });

    this.client.connect((err) => {
      if (err) {
        console.error(`DB connection error: ${err}`);
      } else {
        console.log('DB connected');
      }
    });
  }

  isAlive() {
    return this.client.isConnected();
  }   

  async nbUsers() {
    const db = this.client.db();
    const collection = db.collection('users');
    const count = await collection.countDocuments();
    return count;
  }

  async nbFiles() {
    const db = this.client.db();
    const collection = db.collection('files');
    const count = await collection.countDocuments();
    return count;
  }

  async getUserByEmail(email) {
    const db = this.client.db();
    const collection = db.collection('users');
    return collection.findOne({ email });
  }

  async insertUser(user) {
    const db = this.client.db();
    const collection = db.collection('users');
    const result = await collection.insertOne(user);
    return result.ops[0];
  }

  async getUserByEmailAndPassword(email, password) {
    const db = this.client.db();
    const collection = db.collection('users');
    return collection.findOne({ email, password });
  }

  async getUserById(id) {
    const db = this.client.db();
    const collection = db.collection('users');
    return collection.findOne({ _id: new ObjectId(id) });
  }

  async insertFile(fileData) {
    const db = this.client.db();
    const collection = db.collection('files');
    const result = await collection.insertOne(fileData);
    return result.ops[0];
  }

  async updateFileLocalPath(fileId, localPath) {
    const db = this.client.db();
    const collection = db.collection('files');
    await collection.updateOne({ _id: new ObjectId(fileId) }, { $set: { localPath } });
  }
}

const dbClient = new DBClient();

module.exports = dbClient;
