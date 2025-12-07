import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return this.authMethod === 'email';
    }
  },
  email: {
    type: String,
    sparse: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String
  },
  googleId: {
    type: String,
    sparse: true
  },
  authMethod: {
    type: String,
    enum: ['email', 'google'],
    default: 'email'
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
