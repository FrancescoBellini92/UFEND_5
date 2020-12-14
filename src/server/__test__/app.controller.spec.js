const app = require('../controller/app.controller');
const moment = require('moment');
const supertest = require('supertest');
const request = supertest(app);

describe('Server API', () => {
  const today = moment().toISOString();
  const tomorrow = moment().add(1, 'days').toISOString();
  const realLocation = 'London';
  const fakeLocation = 'Foo bar';
  const name = 'My trip';

  const badDatesPayload = { error: 'Dates are not correct' };
  const badLocationPayload = { error: 'Location could not be found' };
  const badQueryParamsPayload = { error: 'Missing required parameters' };

  const getQueryParams = (start, end, location, name) => `?start=${start}&end=${end}&location=${location}&name=${name}`;

  it('responds 201 to good request', (done) => {
    const queryParams = getQueryParams(today, tomorrow, realLocation, name);
    request.get(`/trip-info${queryParams}`)
      .expect('Content-Type', /json/)
      .expect(201, done);
  });

  it('responds 400 to request with bad dates', (done) => {
    const queryParams = getQueryParams(tomorrow, today, realLocation, name);
    request.get(`/trip-info${queryParams}`)
      .expect('Content-Type', /json/)
      .expect(400, badDatesPayload, done);
  });

  it('responds 400 to request with bad locations', (done) => {
    const queryParams = getQueryParams(today, tomorrow, fakeLocation, name);
    request.get(`/trip-info${queryParams}`)
      .expect('Content-Type', /json/)
      .expect(400, badLocationPayload, done);
  });

  it('responds 400 to request with missing parameter start', (done) => {
    const queryParams = getQueryParams('', tomorrow, realLocation, name);
    request.get(`/trip-info${queryParams}`)
      .expect('Content-Type', /json/)
      .expect(400, badQueryParamsPayload, done);
  });

  it('responds 400 to request with missing parameter end', (done) => {
    const queryParams = getQueryParams(today, '', realLocation, name);
    request.get(`/trip-info${queryParams}`)
      .expect('Content-Type', /json/)
      .expect(400, badQueryParamsPayload, done);
  });

  it('responds 400 to request with missing parameter location', (done) => {
    const queryParams = getQueryParams(today, tomorrow, '', name);
    request.get(`/trip-info${queryParams}`)
      .expect('Content-Type', /json/)
      .expect(400, badQueryParamsPayload, done);
  });

  it('responds 400 to request with missing parameter name', (done) => {
    const queryParams = getQueryParams(today, tomorrow, realLocation, '');
    request.get(`/trip-info${queryParams}`)
      .expect('Content-Type', /json/)
      .expect(400, badQueryParamsPayload, done);
  });
});
