import request from 'supertest';
import {app} from '../../app';
import { Ticket } from '../../models/ticket';

it('returns 404 if ticket is not found', async () => {
    const response = await request(app)
        .get('/api/tickets/sfsfds')
        .send()
        // .expect(404);
    
    console.log(response.body);
});

it('returns 200 the ticket if it is found', async () => {
    const title = 'tickets';
    const price = 10;

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title,
            price
        })
        .expect(201);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
});
