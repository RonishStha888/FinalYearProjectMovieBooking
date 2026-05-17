import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FAQ from './models/FAQ.js';

dotenv.config();

const defaultFAQs = [
  {
    question: 'How do I book a movie ticket?',
    answer: 'You can book tickets by selecting a movie, choosing your showtime, picking your seats, and completing payment on our website.',
    keywords: 'book,ticket,how,purchase,buy,reserve'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept credit/debit cards, eSewa, Khalti, and cash at the counter.',
    keywords: 'payment,pay,card,esewa,khalti,cash,method,accept'
  },
  {
    question: 'Can I cancel or refund my ticket?',
    answer: 'Yes, cancellations are allowed up to 2 hours before the showtime. Refunds are processed within 3-5 business days.',
    keywords: 'cancel,refund,return,money back,cancellation'
  },
  {
    question: 'How do I select seats?',
    answer: 'After choosing your showtime, an interactive seat map will appear. Click on available seats to select them.',
    keywords: 'seat,select,choose,map,pick'
  },
  {
    question: 'Are there any discounts or offers?',
    answer: 'We offer student discounts, weekend combo deals, and loyalty rewards for regular customers.',
    keywords: 'discount,offer,deal,promo,student,cheap,sale'
  },
  {
    question: 'What are the cinema timings?',
    answer: 'Our cinema is open daily from 10:00 AM to 11:00 PM. Showtimes vary by movie.',
    keywords: 'timing,time,open,hours,schedule,when'
  },
  {
    question: 'How do I get my tickets after booking?',
    answer: 'You will receive an e-ticket via email and SMS. You can also download it from your account under "My Bookings".',
    keywords: 'get ticket,e-ticket,download,email,sms,my bookings,receive'
  },
  {
    question: 'Can I book tickets for a group?',
    answer: 'Yes, you can book up to 10 tickets in a single transaction. For larger groups, please contact us directly.',
    keywords: 'group,multiple,bulk,many people,friends,family'
  },
  {
    question: 'Is there parking available?',
    answer: 'Yes, we have free parking available for all moviegoers.',
    keywords: 'parking,park,car,vehicle'
  },
  {
    question: 'Do you have food and beverages?',
    answer: 'Yes, we have a full concession stand with popcorn, drinks, snacks, and combo meals.',
    keywords: 'food,drink,popcorn,snack,beverage,concession,eat,combo'
  }
];

async function seedFAQs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if FAQs already exist
    const existingCount = await FAQ.countDocuments();
    
    if (existingCount > 0) {
      console.log(`ℹ️  ${existingCount} FAQs already exist. Skipping seed.`);
      console.log('💡 To re-seed, delete existing FAQs first.');
    } else {
      // Insert default FAQs
      await FAQ.insertMany(defaultFAQs);
      console.log(`✅ Successfully seeded ${defaultFAQs.length} FAQs`);
    }

    // Display seeded FAQs
    const allFAQs = await FAQ.find();
    console.log('\n📋 Current FAQs in database:');
    allFAQs.forEach((faq, index) => {
      console.log(`\n${index + 1}. ${faq.question}`);
      console.log(`   Keywords: ${faq.keywords}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding FAQs:', error);
    process.exit(1);
  }
}

seedFAQs();
