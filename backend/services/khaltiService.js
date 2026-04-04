import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;
// Sandbox URL for testing
const KHALTI_BASE_URL = 'https://a.khalti.com/api/v2';

/**
 * Initiate Khalti payment (v2 sandbox)
 */
export const initiateKhaltiPayment = async ({ amount, purchaseOrderId, purchaseOrderName, customerInfo, returnUrl, websiteUrl }) => {
  try {
    console.log('💜 Initiating Khalti payment...');
    console.log('Amount (paisa):', amount, '= Rs.', amount / 100);

    const response = await axios.post(
      `${KHALTI_BASE_URL}/epayment/initiate/`,
      {
        return_url: returnUrl,
        website_url: websiteUrl,
        amount,
        purchase_order_id: purchaseOrderId,
        purchase_order_name: purchaseOrderName,
        customer_info: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone
        }
      },
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Khalti payment initiated!');
    console.log('Payment URL:', response.data.payment_url);

    return {
      success: true,
      payment_url: response.data.payment_url,
      pidx: response.data.pidx
    };
  } catch (error) {
    console.error('❌ Khalti initiation failed:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

/**
 * Verify Khalti payment using pidx (v2 sandbox)
 */
export const verifyKhaltiPayment = async (pidx) => {
  try {
    console.log('🔍 Verifying Khalti payment, pidx:', pidx);

    const response = await axios.post(
      `${KHALTI_BASE_URL}/epayment/lookup/`,
      { pidx },
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = response.data;
    console.log('✅ Khalti lookup response:', data);

    if (data.status === 'Completed') {
      return { success: true, data };
    } else {
      return { success: false, error: `Payment status: ${data.status}` };
    }
  } catch (error) {
    console.error('❌ Khalti verification failed:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};
