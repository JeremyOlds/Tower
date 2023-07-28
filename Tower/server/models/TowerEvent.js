import mongoose from "mongoose";
const Schema = mongoose.Schema


export const TowerEventSchema = new Schema({
  creatorId: { type: Schema.Types.ObjectId, required: true, ref: 'Account' },
  name: { type: String, maxlength: 50, minlength: 3 },
  description: { type: String },
  coverImg: { type: String, maxlength: 500, minlength: 5 },
  location: { type: String, maxlength: 50, minlength: 3 },
  capacity: { type: Number },
  startDate: { type: Date },
  isCanceled: { type: Boolean, default: false },
  type: { type: String, enum: ['concert', 'convention', 'sport', 'digital'] }
}, { timestamps: true, toJSON: { virtuals: true } })

// TowerEventSchema.virtual

TowerEventSchema.virtual('ticketCount', {
  localField: '_id',
  foreignField: "eventId",
  ref: 'Ticket',
  count: true
})