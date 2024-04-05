const express = require('express');
const request = require('supertest');
const URL = 'http://localhost:3000'; // Assuming your server runs on this URL
const bodyParser = require("body-parser");
const app = express();
require('dotenv').config();

const previousRouter = require('../routes/previous');

app.use('/previous', previousRouter);
app.use(bodyParser.json());

describe('testing-guest-routes', () => {
  let token;

  test('POST /login - success', async () => {
    const credentials = { email: 'johndoe@yahoo.com', password: '0000' };
    const { body } = await request(app).post('/login').send(credentials);
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('token');
    token = body.data.token;
  });

  test('GET /previous/add - success', async () => {
    const { body } = await request(URL)
      .get('/previous/add/1')
      .set('Authorization', 'Bearer ' + token);
    expect(body).toHaveProperty("previousValue");
    expect(body).toHaveProperty("result");
    expect(parseInt(body.result)).toBe(parseInt(body.previousValue) + 1);
  });

  test('GET /previous/subtract - success', async () => {
    const { body } = await request(URL)
      .get('/previous/subtract/1')
      .set('Authorization', 'Bearer ' + token);
    expect(body).toHaveProperty('previousValue');
    expect(body).toHaveProperty('result');
    expect(parseInt(body.result)).toBe(parseInt(body.previousValue) - 1);
  });

  test('GET /previous/multiply - success', async () => {
    const { body } = await request(URL)
      .get('/previous/multiply/2')
      .set('Authorization', 'Bearer ' + token);
    expect(body).toHaveProperty('previousValue');
    expect(body).toHaveProperty('result');
    expect(parseInt(body.result)).toBe(parseInt(body.previousValue) * 2);
  });

  test('GET /previous/divide - success', async () => {
    const { body } = await request(URL)
      .get('/previous/divide/2')
      .set('Authorization', 'Bearer ' + token);
    expect(body).toHaveProperty('previousValue');
    expect(body).toHaveProperty('result');
    expect(parseInt(body.result)).toBe(parseInt(body.previousValue) / 2);
  });

  test("GET /previous/sqrt - success", async () => {
    await request(app).get("/add/1/2").set('Authorization', 'Bearer ' + token);
    const { body } = await request(app).get("/previous/sqrt").set('Authorization', 'Bearer ' + token);
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("previousValue");
    expect(body.data).toHaveProperty("result");
    expect(body.data).toHaveProperty("message");
    expect(parseInt(body.data.result)).toBe(Math.round(Math.sqrt(body.data.previousValue)));
    expect(body.data.message).toBe("Result has been rounded, as it was not an integer");
});
});
