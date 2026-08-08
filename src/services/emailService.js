/**
 * LYNTRIX REAL AUTOMATED EMAIL DISPATCH SERVICE
 * Handles Real Inbox Delivery via EmailJS / Resend API or Fallback Simulation
 */

export const emailService = {
  // Send Real Order/Proposal Notification to Admin Inbox
  sendAdminOrderAlert: async (orderData) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    console.log(`[EMAIL DISPATCHER] Dispatching proposal alert to admin@lyntrix.tech...`);

    const emailPayload = {
      service_id: serviceId || 'default_service',
      template_id: templateId || 'template_order',
      user_id: publicKey || 'public_key',
      template_params: {
        to_email: 'admin@lyntrix.tech',
        order_id: orderData.id,
        client_name: orderData.name,
        client_email: orderData.email,
        client_phone: orderData.phone || 'N/A',
        service_title: orderData.service,
        budget_range: orderData.budget,
        details: orderData.details,
        date: orderData.date
      }
    };

    if (serviceId && templateId && publicKey) {
      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailPayload)
        });
        if (response.ok) {
          return { success: true, timestamp: new Date().toLocaleTimeString(), realEmailSent: true };
        }
      } catch (err) {
        console.warn('EmailJS API dispatch error:', err);
      }
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          messageId: `msg_${Math.random().toString(36).substring(2, 10)}`,
          timestamp: new Date().toLocaleTimeString(),
          recipient: 'admin@lyntrix.tech',
          realEmailSent: false
        });
      }, 500);
    });
  },

  // Send Real 6-Digit OTP Code to Client Inbox
  generateAndSendOTP: async (userEmail) => {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[EMAIL DISPATCHER] Generated OTP ${otpCode} for ${userEmail}`);
    
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const otpTemplateId = import.meta.env.VITE_EMAILJS_OTP_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    let realSent = false;

    if (serviceId && otpTemplateId && publicKey) {
      try {
        const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: otpTemplateId,
            user_id: publicKey,
            template_params: {
              to_email: userEmail,
              user_email: userEmail,
              otp_code: otpCode,
              message: `Your Lyntrix 6-digit verification code is: ${otpCode}`
            }
          })
        });
        if (res.ok) {
          realSent = true;
        }
      } catch (e) {
        console.warn('Real EmailJS dispatch failed:', e);
      }
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          otpCode,
          userEmail,
          expiresInSeconds: 120,
          realSent
        });
      }, 400);
    });
  }
};
