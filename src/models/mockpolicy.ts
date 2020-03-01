import { IMockPolicy } from '../interfaces/IMockPolicy';
import mongoose from 'mongoose';

const MockPolicy = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Please enter ID'],
      index: true,
    },
    amountInsured: {
      type: Number,
      required: [true, 'Please enter amount ID'],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      index: true,
    },
    inceptionDate: {
      type: String,
    },
    installmentPayment: {
      type: Boolean,
    },
    clientId: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IMockPolicy & mongoose.Document>('MockPolicy', MockPolicy);
