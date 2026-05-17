import mongoose from 'mongoose';

const chatLogSchema = new mongoose.Schema({
  userMessage: {
    type: String,
    required: true
  },
  matchedFaqId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FAQ',
    default: null  // null when no match found
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for analytics queries
chatLogSchema.index({ createdAt: -1 });
chatLogSchema.index({ matchedFaqId: 1 });

const ChatLog = mongoose.model('ChatLog', chatLogSchema);

export default ChatLog;
