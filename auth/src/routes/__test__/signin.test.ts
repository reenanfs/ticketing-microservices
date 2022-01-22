import request from 'supertest';
import { app } from '../../app';

it('fails when email that does not exist is provided', async () => {
  const res = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('expects a 400 return with an invalid email', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'dgdfgd',
      password: 'password',
    })
    .expect(400);
});

it('expects a 400 return with missing email and password', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signin')
    .send({
      password: 'password',
    })
    .expect(400);
});

it('is sucessful when sign in is done with valid email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});

it('fails when password is incorrect', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '4242',
    })
    .expect(400);
});

it('responds with cookie when signin is succesful', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
