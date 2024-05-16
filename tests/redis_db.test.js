import { expect, use, should } from 'chai';
import chaiHttp from 'chai-http';
import { promisify } from 'util';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

use(chaiHttp);
should();

// redisClient

describe('testing the clients for MongoDB and Redis', () => {
  describe('redis Client', () => {

    it('shows that connection is alive', async () => {
      expect(redisClient.isAlive()).to.equal(true);
    });

    it('returns key as null because it does not exist', async () => {
      expect(await redisClient.get('myKey')).to.equal(null);
    });

    it('returns key with null because it expired', async () => {
      const sleep = promisify(setTimeout);
      await sleep(1100);
      expect(await redisClient.get('myKey')).to.equal(null);
    });
  });

  // dbClient
  describe('db Client', () => {

    it('shows that connection is alive', () => {
      expect(dbClient.isAlive()).to.equal(true);
    });

    it('shows that connection is alive', () => {
      expect(dbClient.isAlive()).to.equal(true);
    });

    it('shows number of user documents', async () => {
      expect(await dbClient.nbUsers()).to.equal(1);

      await dbClient.usersCollection.insertOne({ name: 'Larry' });
      await dbClient.usersCollection.insertOne({ name: 'Karla' });
      expect(await dbClient.nbUsers()).to.equal(2);
    });
  });
});