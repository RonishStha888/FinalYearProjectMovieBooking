import mongoose from 'mongoose';

const emailVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  code: {
    type: String,
    required: true
  },
  userData: {
    type: Object,
    required: true
  },
  verificationType: {
    type: String,
    enum: ['signup', 'google-signup'],
    default: 'signup'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 900 // 15 minutes expiration
  }
});

export default mongoose.model('EmailVerification', emailVerificationSchema);