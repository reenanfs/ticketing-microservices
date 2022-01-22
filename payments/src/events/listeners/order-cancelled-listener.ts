import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@reenanfs-ticketing/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const { id, version } = data;

    const order = await Order.findByIdAndVersion({ id, version });

    if (!order) {
      throw new NotFoundError();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    msg.ack();
  }
}
