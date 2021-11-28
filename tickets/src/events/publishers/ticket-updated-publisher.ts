import {Publisher, Subjects, TicketUpdatedEvent } from '@reenanfs-ticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated; 
}