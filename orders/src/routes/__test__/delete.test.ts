import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

it('deletes one order', async () => {
  const userOne = global.signin();

  const ticket = Ticket.build({
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
    .delete('/api/orders/' + order.id)
    .set('Cookie', userOne)
    .send()
    .expect(200);

  expect(fechedOrder.body.status).toEqual(OrderStatus.Cancelled);
});

it('returns 401 if incorrect user makes the request', async () => {
  const userOne = global.signin();

  const ticket = Ticket.build({
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
    .delete('/api/orders/' + order.id)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
