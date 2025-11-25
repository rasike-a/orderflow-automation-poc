async function handlePaymentJob(payload) {
    console.log("Simulating payment job for", payload.orderId);
    await new Promise(r => setTimeout(r, 600));
    return { success: true };
  }
  
  async function handleAmazonAddressJob(payload) {
    console.log("Simulating Amazon address update", payload.orderId);
    await new Promise(r => setTimeout(r, 500));
    return { success: true };
  }
  
  async function handleAmazonGiftJob(payload) {
    console.log("Simulating Amazon gift toggle", payload.orderId);
    await new Promise(r => setTimeout(r, 500));
    return { success: true };
  }
  
  module.exports = {
    handlers: {
      PAYMENT_JOB: handlePaymentJob,
      AMAZON_ADDRESS_JOB: handleAmazonAddressJob,
      AMAZON_GIFT_JOB: handleAmazonGiftJob
    }
  };
  