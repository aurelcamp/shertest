import { User } from "./user";

export class Appointment {
  dateStart: Date;
  dateEnd: Date;
  title: string;
  sender?: User;
  receiver?: User;
  senderId: string;
  receiverId: string;
  senderCalendarEventId?: number;
  receiverCalendarEventId?: number;
}