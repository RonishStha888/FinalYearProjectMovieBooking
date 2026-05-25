import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  code: {
    type: String,
    required: false // Keep for backward compatibility
  },
  token: {
    type: String,
    required: false
  },
  expiresAt: {
    type: Date,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Document will be automatically deleted after 1 hour (3600 seconds)
  }
});

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

export default PasswordReset;
