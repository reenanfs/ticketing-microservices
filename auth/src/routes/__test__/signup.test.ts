import request from 'supertest';;
import { app } from '../../app';

it ('expects a 201 return on successful signup', async() => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
});

it ('expects a 400 return with an invalid email', async() => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'dgdfgd',
            password: 'password'
        })
        .expect(400);
});

it ('expects a 400 return with an invalid password', async() => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: '1'
        })
        .expect(400);
});

it ('expects a 400 return with missing email and password', async() => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
        })
        .expect(400);

    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'password'
        })
        .expect(400);
});


it ('disallows duplicate emails', async() => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it ('set a cookie after successful signup', async() => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    
    expect(response.get('Set-Cookie')).toBeDefined();
});
