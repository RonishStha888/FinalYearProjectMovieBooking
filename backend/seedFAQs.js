import mongoose from 'mongoose';
import FAQ from './models/FAQ.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const faqs = [
  // Booking & Tickets
  {
    question: "How do I book tickets?",
    answer: "You can book tickets easily on our website! Just:\n1. Browse movies on the homepage\n2. Select your preferred movie\n3. Choose cinema, date, and showtime\n4. Select your seats\n5. Add food & beverages (optional)\n6. Complete payment\n\nYou'll receive your e-ticket via email!",
    keywords: "book,booking,tickets,reserve,reservation,how,purchase,buy"
  },
  {
    question: "Can I cancel my booking?",
    answer: "Yes, you can cancel your booking up to 2 hours before the showtime. To cancel:\n1. Go to 'My Bookings' in your profile\n2. Select the booking you want to cancel\n3. Click 'Cancel Booking'\n\nRefunds will be processed within 5-7 business days.",
    keywords: "cancel,cancellation,refund,return,money,back"
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept multiple payment methods:\n• Khalti\n• eSewa\n• Credit/Debit Cards\n• Mobile Banking\n\nAll payments are secure and encrypted!",
    keywords: "payment,pay,khalti,esewa,card,credit,debit,method,how,money"
  },
  {
    question: "How do I get my tickets?",
    answer: "After successful payment, you'll receive:\n1. E-ticket via email\n2. Booking confirmation on your profile\n3. QR code for entry\n\nJust show the QR code at the cinema entrance!",
    keywords: "ticket,eticket,receive,get,email,qr,code,confirmation"
  },
  
  // Showtimes & Movies
  {
    question: "What are your show timings?",
    answer: "Our showtimes vary by cinema and movie. Typically:\n• Morning shows: 10:00 AM - 12:00 PM\n• Afternoon shows: 1:00 PM - 4:00 PM\n• Evening shows: 5:00 PM - 8:00 PM\n• Night shows: 9:00 PM onwards\n\nCheck our website for specific showtimes for each movie!",
    keywords: "showtime,timing,time,schedule,when,hours,show"
  },
  {
    question: "Do you have 3D movies?",
    answer: "Yes! We offer 3D movies at select cinemas. Look for the '3D' tag when browsing movies. 3D glasses are provided at the cinema.\n\nCinemas with 3D:\n• QFX Civil Mall\n• QFX Jai Nepal\n• Fcube Cinemas",
    keywords: "3d,three,dimension,glasses,imax,special"
  },
  
  // Cinemas & Locations
  {
    question: "Where are your cinemas located?",
    answer: "We have cinemas across Kathmandu Valley:\n\n🎬 Kathmandu:\n• QFX Labim Mall - Pulchowk\n• QFX Civil Mall - Sundhara\n• QFX Jai Nepal - Jamal\n• Gopi Krishna Movies - Jamal\n\n🎬 Bhaktapur:\n• Fcube Cinemas - Sallaghari\n• Big Movies - Kamal Binayak\n\nVisit our 'Cinemas' page for directions!",
    keywords: "location,where,cinema,address,branch,place,find"
  },
  {
    question: "Do you have parking facilities?",
    answer: "Yes! Most of our cinemas offer parking:\n\n✅ With Parking:\n• QFX Labim Mall\n• QFX Civil Mall\n• Fcube Cinemas\n• Big Movies\n\n❌ Limited Parking:\n• QFX Jai Nepal\n• Gopi Krishna Movies\n\nWe recommend using public transport or ride-sharing for city center locations.",
    keywords: "parking,park,car,vehicle,space,lot"
  },
  
  // Food & Beverages
  {
    question: "Can I order food at the cinema?",
    answer: "Absolutely! We offer a variety of food & beverages:\n• Popcorn (Small, Medium, Large)\n• Soft Drinks\n• Nachos\n• Hot Dogs\n• Combo Deals\n\nYou can pre-order while booking tickets or buy at the cinema counter!",
    keywords: "food,snacks,popcorn,drinks,beverages,eat,combo,nachos"
  },
  {
    question: "Do you have combo offers?",
    answer: "Yes! We have great combo deals:\n\n🍿 Classic Combo - NPR 450\n• 1 Large Popcorn\n• 2 Soft Drinks\n\n🌭 Mega Combo - NPR 650\n• 1 Large Popcorn\n• 2 Soft Drinks\n• 1 Hot Dog\n• 1 Nachos\n\nCheck our F&B menu while booking!",
    keywords: "combo,offer,deal,package,discount,special,promotion"
  },
  
  // Loyalty & Rewards
  {
    question: "Do you have a loyalty program?",
    answer: "Yes! Join RTX Rewards and earn points:\n\n💎 Earn Points:\n• 10 points per NPR 100 spent\n• Bonus points on special days\n• Birthday rewards\n\n🎁 Redeem Points:\n• Free tickets\n• Food vouchers\n• Exclusive discounts\n\nSign up on our website to start earning!",
    keywords: "loyalty,rewards,points,earn,redeem,membership,program"
  },
  
  // Technical Support
  {
    question: "I'm having trouble with the website",
    answer: "Sorry to hear that! Try these steps:\n\n1. Clear your browser cache\n2. Try a different browser\n3. Check your internet connection\n4. Disable ad blockers\n\nStill having issues? Contact us:\n📞 Call: 9828999454\n💬 WhatsApp: 9828999454\n📧 Email: support@rtxcinema.com",
    keywords: "problem,issue,error,bug,not,working,website,technical,help,support"
  },
  {
    question: "How do I create an account?",
    answer: "Creating an account is easy!\n\n1. Click 'Sign Up' on the homepage\n2. Enter your details:\n   • Name\n   • Email\n   • Phone number\n   • Password\n3. Verify your email\n4. Start booking!\n\nBenefits:\n✅ Faster checkout\n✅ Booking history\n✅ Loyalty points\n✅ Exclusive offers",
    keywords: "account,signup,register,create,join,new,user"
  },
  
  // Pricing & Discounts
  {
    question: "What are your ticket prices?",
    answer: "Ticket prices vary by cinema, movie type, and showtime:\n\n💰 Standard Movies:\n• Weekdays: NPR 300-400\n• Weekends: NPR 400-500\n\n💰 3D Movies:\n• Weekdays: NPR 450-550\n• Weekends: NPR 550-650\n\n🎉 Special Discounts:\n• Student discounts (with ID)\n• Senior citizen discounts\n• Group bookings (10+ people)\n\nPrices shown during booking!",
    keywords: "price,cost,ticket,how,much,rate,charge,fee"
  },
  {
    question: "Do you offer student discounts?",
    answer: "Yes! Students get 10% off on weekday shows!\n\n📚 How to avail:\n1. Book tickets online\n2. Show your valid student ID at the counter\n3. Get your discount!\n\n⚠️ Terms:\n• Valid student ID required\n• Weekdays only (Mon-Fri)\n• Not applicable on public holidays\n• Cannot be combined with other offers",
    keywords: "student,discount,offer,id,card,college,university,school"
  },
  
  // Contact & Support
  {
    question: "How can I contact you?",
    answer: "We're here to help! Contact us:\n\n📞 Phone: 9828999454\n💬 WhatsApp: 9828999454\n📧 Email: support@rtxcinema.com\n\n🕐 Support Hours:\nDaily: 10:00 AM - 9:00 PM\n\nFor urgent issues, call or WhatsApp us!",
    keywords: "contact,call,phone,email,support,help,reach,customer,service"
  },
  {
    question: "What are your operating hours?",
    answer: "Our cinemas are open daily!\n\n🎬 Cinema Hours:\n• First show: 10:00 AM\n• Last show: 10:00 PM\n\n🎫 Booking:\n• Online: 24/7\n• Counter: 9:30 AM - 10:30 PM\n\n📞 Customer Support:\n• Daily: 10:00 AM - 9:00 PM",
    keywords: "hours,timing,open,close,operating,time,when"
  },
  
  // Age Restrictions
  {
    question: "Are there age restrictions for movies?",
    answer: "Yes, we follow the Film Censor Board ratings:\n\n🎬 U (Universal): All ages\n🎬 U/A: Parental guidance for under 12\n🎬 A (Adult): 18+ only (ID required)\n\nAge verification may be required at entry. Please carry a valid ID for A-rated movies.",
    keywords: "age,restriction,rating,adult,children,kids,censor,allowed"
  }
];

async function seedFAQs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Clear existing FAQs
    await FAQ.deleteMany({});
    console.log('Cleared existing FAQs\n');

    // Insert new FAQs
    await FAQ.insertMany(faqs);
    console.log(`✓ Successfully seeded ${faqs.length} FAQs!\n`);

    console.log('FAQ Categories:');
    console.log('• Booking & Tickets: 4 FAQs');
    console.log('• Showtimes & Movies: 2 FAQs');
    console.log('• Cinemas & Locations: 2 FAQs');
    console.log('• Food & Beverages: 2 FAQs');
    console.log('• Loyalty & Rewards: 1 FAQ');
    console.log('• Technical Support: 2 FAQs');
    console.log('• Pricing & Discounts: 2 FAQs');
    console.log('• Contact & Support: 2 FAQs');
    console.log('• Age Restrictions: 1 FAQ');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding FAQs:', error);
    process.exit(1);
  }
}

seedFAQs();
