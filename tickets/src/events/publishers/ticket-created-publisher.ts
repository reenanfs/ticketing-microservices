import {Publisher, Subjects, TicketCreatedEvent } from '@reenanfs-ticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    
}