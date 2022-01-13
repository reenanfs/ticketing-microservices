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

    res.status(20).send({ success: true });
  }
);

export { router as createChargeRouter };
