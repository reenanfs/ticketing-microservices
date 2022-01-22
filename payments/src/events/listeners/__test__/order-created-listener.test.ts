import { OrderCreatedEvent, OrderStatus } from '@reenanfs-ticketing/common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import mongoose from 'mongoose';
import { Order } from '../../../models/order';

const testSetup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'sdf',
    expiresAt: 'dfg',
    ticket: {
      id: 'dgdfgdfg',
      price: 20,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('replicates order info', async () => {
  const { listener, data, msg } = await testSetup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it('calls ack function', async () => {
  const { listener, data, msg } = await testSetup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
