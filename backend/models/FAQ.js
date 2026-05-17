import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true
  },
  keywords: {
    type: String,
    required: true,
    lowercase: true
  }
}, {
  timestamps: true
});

// Text index for faster keyword searches
faqSchema.index({ keywords: 'text' });

const FAQ = mongoose.model('FAQ', faqSchema);

export default FAQ;
