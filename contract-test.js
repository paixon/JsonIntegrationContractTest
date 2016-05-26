var testRequest = require('supertest');
var expect = require('chai').expect;
var Ajv = require('ajv');

var ajv = Ajv({
  allErrors: true,
  // Require all schemas. Don't forget referenced schemas!
  schemas: [
    require('./schemas/artists.json'),
    require('./schemas/artist.json'),
  ]
});

// API https://developer.spotify.com/web-api/search-item/
var url = 'https://api.spotify.com/v1';
var valid;

function assertJson(schema, body, error) {
  if (error) throw error;
  valid = ajv.validate(schema, body);
  var detailedErrorMsg = "\n" + ajv.errorsText(ajv.errors, {separator: "\n"}) + "\n";
  expect(valid, detailedErrorMsg).to.be.true;
}

describe('Searching for artists with the name ', function () {
  
  it('Bomba Estereo', function (done) {
    testRequest(url)
       // Call HTTP-method (get, post, put, ...)
      .get('/search?q=bomba%20estereo&type=artist')
       // Check Content-Type
      .expect('Content-Type', /json/)
      // Check HTTP status code
      .expect(200)
      .end(function (err, res) {
      	// Assert body against schema
        assertJson("/Artists#", res.body, err);
        done();
      });
  });

  it('The Bombadils', function (done) {
    testRequest(url)
      .get('/search?q=The%20Bombadils&type=artist')
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        assertJson("/Artists#", res.body, err);
        done();
      });
  });

  it('Bomba', function (done) {
    testRequest(url)
      .get('/search?q=bomba&type=artist')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        assertJson("/Artists#", res.body, err);
        done();
      });
  });

});