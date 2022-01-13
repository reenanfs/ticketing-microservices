import { OrderStatus } from '@reenanfs-ticketing/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('returns 404 when trying to purchase order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'hjhjh',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns 401 when purchasing an order that does not belong to user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    userId: 'bdfgdgf',
    version: 0,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'hjhjh',
      orderId: order.id,
    })
    .expect(401);
});

it('returns 400 when purchasing an cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    userId,
    version: 0,
  });

  await order.save();
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      title: 'tickets',
      price: 10,
    })
    .expect(201);
});

// it('returns an error if invalid title is provided', async () => {
//   await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.signin())
//     .send({
//       title: '',
//       price: 10,
//     })
//     .expect(400);

//   await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.signin())
//     .send({
//       price: 10,
//     })
//     .expect(400);
// });

// it('returns an error if invalid price is provided', async () => {
//   await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.signin())
//     .send({
//       title: 'ticker',
//       price: -10,
//     })
//     .expect(400);

//   await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.signin())
//     .send({
//       title: 'ticket',
//     })
//     .expect(400);
// });

// it('creates a ticket with valid parameters', async () => {
//   let tickets = await Ticket.find({});
//   expect(tickets.length).toEqual(0);

//   await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.signin())
//     .send({
//       title: 'tickets',
//       price: 10,
//     })
//     .expect(201);

//   tickets = await Ticket.find({});
//   expect(tickets.length).toEqual(1);
//   expect(tickets[0].price).toEqual(10);
// });

// it('publishes an event', async () => {
//   await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.signin())
//     .send({
//       title: 'tickets',
//       price: 10,
//     })
//     .expect(201);

//   expect(natsWrapper.client.publish).toHaveBeenCalled();
// });
