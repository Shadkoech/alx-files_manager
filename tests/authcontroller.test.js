import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { v4 as uuidv4 } from 'uuid';
import AuthController from '../controllers/AuthController';
import redisClient from '../utils/redis';

chai.use(chaiHttp);

describe('AuthController', () => {
  describe('getConnect', () => {
    it('should return a valid token for valid credentials', async () => {
      const email = 'valid@example.com';
      const password = 'validpassword';
      // Assuming a valid user with the provided credentials exists in the database
      const response = await chai.request(AuthController)
        .getConnect()
        .set('Authorization', `Basic ${Buffer.from(`${email}:${password}`).toString('base64')}`);
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('token').that.is.a('string');
    });

    it('should return an error for invalid credentials', async () => {
      const email = 'invalid@example.com';
      const password = 'invalidpassword';
      // Assuming no user with the provided credentials exists in the database
      const response = await chai.request(AuthController)
        .getConnect()
        .set('Authorization', `Basic ${Buffer.from(`${email}:${password}`).toString('base64')}`);
      expect(response).to.have.status(401);
      expect(response.body).to.have.property('error').that.equals('Unauthorized');
    });
  });

  describe('getDisconnect', () => {
    it('should successfully remove the token from Redis', async () => {
      const token = uuidv4(); // Assuming a valid token exists in Redis
      await redisClient.set(`auth_${token}`, 'userId', 86400); // Mocking token existence
      const response = await chai.request(AuthController)
        .getDisconnect()
        .set('x-token', token);
      expect(response).to.have.status(204);
      // Verify that the token is removed from Redis
      const tokenExists = await redisClient.get(`auth_${token}`);
      expect(tokenExists).to.be.null;
    });

    it('should return an error for invalid or missing tokens', async () => {
      // Assuming no token is provided
      const response = await chai.request(AuthController)
        .getDisconnect();
      expect(response).to.have.status(401);
      expect(response.body).to.have.property('error').that.equals('Unauthorized');
    });
  });
});
