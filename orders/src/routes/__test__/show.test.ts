import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

it('fetches one ticket', async () => {
  const userOne = global.signin();

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 200,
  });

  await ticket.save();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  const fechedOrder = await request(app)
    .get('/api/orders/' + order.id)
    .set('Cookie', userOne)
    .send()
    .expect(200);

  expect(fechedOrder.body.id).toEqual(order.id);
});

it('returns 401 if incorrect user makes the request', async () => {
  const userOne = global.signin();

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 200,
  });

  await ticket.save();

  const order = Order.build({
    ticket,
    userId: 'hgsjsg',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await order.save();

  const fechedOrder = await request(app)
    .get('/api/orders/' + order.id)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
