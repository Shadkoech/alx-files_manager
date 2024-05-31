const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('../server'); // Assuming the server.js file exports the Express app

chai.use(chaiHttp);

describe('Server', () => {
  it('should start the server and listen on the specified port', (done) => {
    const PORT = 3000; // Assuming the server is configured to run on port 5000
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      server.close(); // Close the server after testing
      done(); // Indicate that the test is done
    });
  });

  it('should use JSON parsing middleware', async () => {
    const response = await chai.request(app).post('/test-json').send({ key: 'value' });
    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal({ key: 'value' });
  });

  it('should register and access routes correctly', async () => {
    const response = await chai.request(app).get('/test-route');
    expect(response).to.have.status(200);
    expect(response.text).to.equal('Route accessed successfully');
  });
});
