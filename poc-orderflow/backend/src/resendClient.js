require("dotenv").config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM_EMAIL;

async function sendEmail({ to, subject, html }) {
  if (!RESEND_API_KEY || !FROM) {
    console.warn("RESEND_API_KEY or RESEND_FROM_EMAIL not set, skipping email send");
    return { mock: true, message: "Email not sent (API key missing)" };
  }

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ from: FROM, to, subject, html })
    });
    
    if (!r.ok) {
      throw new Error(`Resend API error: ${r.statusText}`);
    }
    
    return r.json();
  } catch (error) {
    console.error("Resend API error:", error);
    return { error: error.message, mock: true };
  }
}

async function sendOrderReceivedEmail({ to, productName, orderId }) {
  return sendEmail({
    to,
    subject: `Order received: ${productName}`,
    html: `<h2>Order Received</h2><p>Order ID: ${orderId}</p>`
  });
}

async function sendOrderProcessedEmail({ to, productName, orderId, summary }) {
  return sendEmail({
    to,
    subject: `Order processed: ${productName}`,
    html: `<h2>Order Processed</h2><pre>${summary}</pre>`
  });
}

module.exports = {
  sendEmail,
  sendOrderReceivedEmail,
  sendOrderProcessedEmail
};

