import mongoose from 'mongoose';

const warningSchema = new mongoose.Schema(
  {
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['NORMAL', 'WARNING', 'HIGH TEMPERATURE'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    collection: 'warnings',
    timestamps: false,
  }
);

export const Warning = mongoose.model('Warning', warningSchema);
