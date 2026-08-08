/**
 * LYNTRIX AUTOMATED EMAIL DISPATCH SERVICE
 * Handles Admin Instant Order Notifications and Client OTP Verification Emails
 */

export const emailService = {
  // Send Order/Proposal Notification to Admin
  sendAdminOrderAlert: async (orderData) => {
    console.log(`[EMAIL DISPATCHER] Dispatching automated proposal notification to admin@lyntrix.tech...`);
    
    // Email Payload Format
    const emailPayload = {
      to: 'admin@lyntrix.tech',
      subject: `🚨 NEW CLIENT PROPOSAL ORDER: ${orderData.id} - ${orderData.name}`,
      body: `
==================================================
LYNTRIX AUTOMATED SOC ORDER NOTIFICATION
==================================================
Order ID: ${orderData.id}
Date: ${orderData.date}

CLIENT DETAILS:
- Name: ${orderData.name}
- Email: ${orderData.email}
- Phone: ${orderData.phone || 'N/A'}

TECHNICAL REQUIREMENTS:
- Primary Service: ${orderData.service}
- Project Scale: ${orderData.scale || 'Custom Enterprise Scope'}
- Estimated Budget: ${orderData.budget}

REQUIREMENT DETAILS:
${orderData.details}
==================================================
      `
    };

    // Simulate SMTP / EmailJS Cloud REST API Request
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          messageId: `msg_${Math.random().toString(36).substring(2, 10)}`,
          timestamp: new Date().toLocaleTimeString(),
          recipient: 'admin@lyntrix.tech',
          payload: emailPayload
        });
      }, 500);
    });
  },

  // Send 6-Digit Verification OTP to Client Email
  generateAndSendOTP: async (userEmail) => {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[EMAIL DISPATCHER] Generated OTP ${otpCode} for ${userEmail}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          otpCode,
          userEmail,
          expiresInSeconds: 120
        });
      }, 400);
    });
  }
};
