import supertest from 'supertest';
import app from '../index.js';
import {expect} from 'chai';
// import sequelize from '../db/sequelize.js';

const request = supertest(app);


describe('User /v1/user API Integration Tests', () => {
  

  // Test 1: Create an account and validate it exists
  it('create an account and validate the created account', async () => {
    const newUser = {
      first_name: 'cloudy',
      last_name: 'user1234',
      username: 'cloudy@gmail.com',
      password: 'cloudy@12345',
    };

    const response = await request
      .post('/v1/user')
      .send(newUser).expect(201);

    const createdUser = response.body;

    const getResponse = await request
      .get('/v1/user/self')
      .set('Authorization', 'Basic ' + Buffer.from(newUser.username+':'+newUser.password).toString('base64')).expect(200);


    const retrievedUser = getResponse.body;

    expect(retrievedUser).to.deep.equal(createdUser);
  });

//   Test 2: Update an account and validate it was updated
  it('update an account and validate it was updated', async () => {
    
    const userData = {
        first_name: 'cloudy',
        last_name: 'user123',
        username: 'cloudy@gmail.com',
        password: 'cloudy@12345',
    };

    const update = {
          first_name: 'test678',
          last_name: 'clouder',
          password: 'pass@0981',
      };

    const response = await request
      .put('/v1/user/self')
      .set('Authorization', 'Basic ' + Buffer.from(userData.username+':'+userData.password).toString('base64'))
      .send(update)
      .expect(204);

    const getResponse = await request
      .get('/v1/user/self')
      .set('Authorization', 'Basic ' + Buffer.from(userData.username+':'+update.password).toString('base64'))
      .expect(200);

    const retrievedUser = getResponse.body;

    expect(retrievedUser.first_name).to.deep.equal(update.first_name);
    expect(retrievedUser.last_name).to.deep.equal(update.last_name);
  });
});
