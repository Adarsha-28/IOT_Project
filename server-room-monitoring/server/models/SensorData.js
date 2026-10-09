import mongoose from 'mongoose';

const sensorDataSchema = new mongoose.Schema(
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
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    collection: 'sensor_data',
    timestamps: false,
  }
);

export const SensorData = mongoose.model('SensorData', sensorDataSchema);
