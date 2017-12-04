const chai = require('chai');
const chaiHttp = require('chai-http');

require('../../../../src/server/api/dogs.js');

chai.use(chaiHttp);

const server = require('../../../../src/server.js');

describe('api', () => {
  describe('dogs', () => {
    describe('get-api-dog-dogId', () => {
      it('should get', (done) => {
        chai.request(server)
          .get('/api/dog/15')
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      })
    });
  });
});