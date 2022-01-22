import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session';

import { errorHandler, currentUser } from '@reenanfs-ticketing/common';
import { newOrderRouter } from './routes/new';
import { deleteOrderRouter } from './routes/delete';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
})
);
app.use(currentUser);
app.use(newOrderRouter);
app.use(deleteOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(errorHandler);

export { app };
