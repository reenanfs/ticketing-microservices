import { OrderCancelledEvent, OrderStatus } from '@reenanfs-ticketing/common';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Order } from '../../../models/order';

const testSetup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    userId: 'bdfgdgf',
    version: 0,
  });

  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'dgdfgdfg',
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, order, data, msg };
};

it('updates the status of the order ', async () => {
  const { listener, data, msg } = await testSetup();
  await listener.onMessage(data, msg);
  const order = await Order.findById(data.id);

  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it('calls ack function', async () => {
  const { listener, data, msg } = await testSetup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
