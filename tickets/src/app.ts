import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session';

import { errorHandler, currentUser } from '@reenanfs-ticketing/common';
import { createTicketRouter } from './routes/new';
import { updateTicketRouter } from './routes/update';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
})
);
app.use(currentUser);
app.use(createTicketRouter);
app.use(updateTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(errorHandler);

export { app };
