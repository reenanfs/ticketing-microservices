import express, {Request, Response} from 'express';
import { RouteNotFoundError } from '@reenanfs-ticketing/common/build';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id',
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            throw new RouteNotFoundError();
        }

        res.status(200).send(ticket);
});

export { router as showTicketRouter };