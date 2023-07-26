import { Schema } from "mongoose";

export const TicketSchema = new Schema({
  eventId: { type: Schema.Types.ObjectId, required: true, ref: 'event' },
  accountId: { type: Schema.Types.ObjectId, required: true, ref: 'Account' },
}, { timestamps: true, toJSON: { virtuals: true } })

TicketSchema.virtual('profile', {
  localField: 'accountId',
  foreignField: '_id',
  justOne: true,
  ref: 'Account',
  required: true
})

TicketSchema.virtual('event', {
  localField: 'eventId',
  foreignField: '_id',
  justOne: true,
  ref: 'TowerEvent'
})
