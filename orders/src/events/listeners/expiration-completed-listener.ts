import {
  Listener,
  Subjects,
  ExpirationCompletedEvent,
  NotFoundError,
  OrderStatus,
} from '@reenanfs-ticketing/common/build';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { queueGroupName } from './queue-group-name';

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationCompleted;
  queueGroupName = queueGroupName;
  async onMessage(data: ExpirationCompletedEvent['data'], msg: Message) {
    const { orderId } = data;
    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
