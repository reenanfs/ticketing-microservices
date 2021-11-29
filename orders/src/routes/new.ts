//import mongoose from 'mongoose'
import express, { Request, Response } from 'express'
import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError } from '@reenanfs-ticketing/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';


const router = express.Router();

router.post('api/orders', requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
//        validatinf if the inputted id is valid  
//        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('Ticket ID must be provided')
] ,validateRequest, async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);

    if(!ticket) {
        throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved()

    if (isReserved) {
        throw new BadRequestError('Ticket is already reserved.');
    }
});

export {router as newOrderRouter};