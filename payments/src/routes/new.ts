import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@reenanfs-ticketing/common/build';
import { Order } from '../models/order';

import { natsWrapper } from '../nats-wrapper';
import { NotFoundError } from '@reenanfs-ticketing/common/build';
import { NotAuthorizedError } from '@reenanfs-ticketing/common/build';
import { BadRequestError } from '@reenanfs-ticketing/common/build';
import { stripe } from '../stripe';
import { Payment } from '../models/payments';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token').not().isEmpty().withMessage('Title is required'),
    body('orderId').not().isEmpty().withMessage('Title is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for an cancelled order.');
    }

    const charge = await stripe.charges.create({
      currency: 'brl',
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
