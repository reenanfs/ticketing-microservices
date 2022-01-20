import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@reenanfs-ticketing/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id: orderId, expiresAt } = data;
    //below code get the time in miliseconds
    const delay = new Date(expiresAt).getTime() - new Date().getTime();
    console.log('waiting this many miliseconds to process the job: ', delay);

    await expirationQueue.add(
      {
        orderId,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}
