const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  // returns true if both redis and db are running
  static getStatus(request, response) {
    const status = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    response.status(200).send(status);
  }

  // Returns number of user and files in DB
  static async getStats(request, response) {
    const stats = {
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    };
    response.status(200).send(stats);
  }
}

module.exports = AppController;
