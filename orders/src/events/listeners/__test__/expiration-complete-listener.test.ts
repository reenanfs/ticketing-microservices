import {
  ExpirationCompletedEvent,
  OrderStatus,
} from '@reenanfs-ticketing/common';
import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompletedListener } from '../expiration-completed-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';

const testSetup = async () => {
  const listener = new ExpirationCompletedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'title',
    price: 20,
  });

  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'uhisf',
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  const data: ExpirationCompletedEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it('updates the order status to cancelled', async () => {
  const { listener, order, ticket, data, msg } = await testSetup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
  const { listener, order, ticket, data, msg } = await testSetup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
  const { listener, order, ticket, data, msg } = await testSetup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
