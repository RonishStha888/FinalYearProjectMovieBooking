import mongoose from 'mongoose';

const systemLogSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['info', 'warning', 'error', 'critical'],
    required: true
  },
  category: {
    type: String,
    enum: ['auth', 'booking', 'payment', 'system', 'admin', 'api'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  endpoint: {
    type: String
  },
  method: {
    type: String
  },
  statusCode: {
    type: Number
  },
  responseTime: {
    type: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// TTL index to automatically delete old logs after 90 days
systemLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

// Indexes for efficient queries
systemLogSchema.index({ level: 1, timestamp: -1 });
systemLogSchema.index({ category: 1, timestamp: -1 });
systemLogSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model('SystemLog', systemLogSchema);