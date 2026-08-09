import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { toEmail, otpCode, purpose = 'Verification', origin } = req.body;

    if (!toEmail || !otpCode) {
      return res.status(400).json({ error: 'toEmail and otpCode are required' });
    }

    const gmailUser = process.env.GMAIL_USER || process.env.VITE_GMAIL_USER || 'madsruzza@gmail.com';
    const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.VITE_GMAIL_APP_PASSWORD || 'bcmfyxbytinwmlzm';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });

    const isReset = purpose.toLowerCase().includes('reset') || purpose.toLowerCase().includes('forgot');
    const isChange = purpose.toLowerCase().includes('change');

    let actionType = 'register';
    let titleText = '🔐 2FA Identity Verification';
    let descText = 'Use the 6-digit OTP code below, OR click the 1-Click Instant Verification button to automatically verify your corporate account:';

    if (isReset) {
      actionType = 'reset';
      titleText = '🔑 Password Reset Request';
      descText = 'Use the 6-digit OTP code below, OR click the 1-Click Verification button to authorize your password reset:';
    } else if (isChange) {
      actionType = 'change_password';
      titleText = '🛡️ Password Change Verification';
      descText = 'Use the 6-digit OTP code below, OR click the button below to confirm your password change:';
    }

    // Build 1-Click Verification URL
    const siteUrl = origin || process.env.SITE_URL || 'https://dilnethmadushanka.online';
    const verifyLink = `${siteUrl}/?verify_otp=${otpCode}&email=${encodeURIComponent(toEmail)}&action=${actionType}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lyntrix Security Verification</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #05070B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #05070B; padding: 40px 15px;">
          <tr>
            <td align="center">
              
              <!-- Container Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background: #0A0E17; border: 1px solid rgba(0, 240, 255, 0.25); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 240, 255, 0.1);">
                
                <!-- Glowing Top Accent -->
                <tr>
                  <td height="4" style="background: linear-gradient(90deg, #00F0FF 0%, #3B82F6 50%, #8B5CF6 100%);"></td>
                </tr>

                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 35px 30px 20px 30px;">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                          <div style="display: inline-block; padding: 12px 20px; background: rgba(0, 240, 255, 0.08); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 12px; margin-bottom: 15px;">
                            <span style="font-family: 'Courier New', monospace; font-size: 22px; font-weight: 800; letter-spacing: 3px; color: #00F0FF; text-transform: uppercase;">
                              ⚡ LYNTRIX
                            </span>
                          </div>
                          <p style="margin: 0; font-size: 11px; font-family: 'Courier New', monospace; color: #64748B; letter-spacing: 2px; text-transform: uppercase;">
                            Enterprise Architecture & Cloud Sentinel
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Main Content Body -->
                <tr>
                  <td style="padding: 10px 40px 30px 40px;">
                    
                    <div style="background: #0E1524; border: 1px solid #1E293B; border-radius: 16px; padding: 30px 25px; text-align: center;">
                      
                      <h2 style="margin: 0 0 12px 0; color: #FFFFFF; font-size: 20px; font-weight: 700; letter-spacing: -0.3px;">
                        ${titleText}
                      </h2>

                      <p style="margin: 0 0 20px 0; color: #94A3B8; font-size: 13px; line-height: 1.6;">
                        ${descText}
                      </p>

                      <!-- Option 1: Glowing OTP Box -->
                      <div style="margin: 0 auto 20px auto; background: linear-gradient(135deg, rgba(0, 240, 255, 0.12) 0%, rgba(59, 130, 246, 0.12) 100%); border: 2px dashed #00F0FF; border-radius: 14px; padding: 16px 25px; display: inline-block;">
                        <span style="font-family: 'Courier New', monospace; font-size: 38px; font-weight: 900; letter-spacing: 12px; color: #00F0FF; text-shadow: 0 0 20px rgba(0, 240, 255, 0.6); display: block; margin-left: 12px;">
                          ${otpCode}
                        </span>
                      </div>

                      <div style="margin: 0 0 20px 0;">
                        <span style="color: #64748B; font-size: 11px; font-family: 'Courier New', monospace;">— OR USE 1-CLICK INSTANT VERIFY LINK —</span>
                      </div>

                      <!-- Option 2: 1-Click Verification Action Button -->
                      <div style="margin-bottom: 25px;">
                        <a href="${verifyLink}" target="_blank" style="display: inline-block; background: linear-gradient(90deg, #00F0FF 0%, #3B82F6 100%); color: #07090E; font-size: 13px; font-weight: 800; font-family: 'Courier New', monospace; text-decoration: none; padding: 14px 28px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 240, 255, 0.35); text-transform: uppercase; letter-spacing: 1px;">
                          ⚡ 1-Click Instant Verify & Continue →
                        </a>
                      </div>

                      <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(51, 65, 85, 0.6); border-radius: 10px; padding: 12px;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td align="left" style="color: #64748B; font-size: 11px; font-family: 'Courier New', monospace;">
                              ⏱️ Validity: <strong style="color: #E2E8F0;">2 Minutes</strong>
                            </td>
                            <td align="right" style="color: #64748B; font-size: 11px; font-family: 'Courier New', monospace;">
                              Recipient: <strong style="color: #00F0FF;">${toEmail}</strong>
                            </td>
                          </tr>
                        </table>
                      </div>

                    </div>

                    <!-- Security Notice -->
                    <div style="margin-top: 25px; padding: 14px; background: rgba(239, 68, 68, 0.05); border-left: 3px solid #EF4444; border-radius: 6px;">
                      <p style="margin: 0; color: #94A3B8; font-size: 11px; line-height: 1.5;">
                        <strong style="color: #F87171;">Security Protocol:</strong> Lyntrix will never ask for your password or OTP code over phone or message. If you did not initiate this request, please secure your account immediately.
                      </p>
                    </div>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 40px 30px 40px; border-top: 1px solid #1E293B; text-align: center;">
                    <p style="margin: 0 0 6px 0; color: #475569; font-size: 11px; font-family: 'Courier New', monospace;">
                      © ${new Date().getFullYear()} LYNTRIX IT SERVICES. All rights reserved.
                    </p>
                    <p style="margin: 0; color: #64748B; font-size: 11px;">
                      Automated Cryptographic Dispatch • <a href="https://dilnethmadushanka.online" style="color: #00F0FF; text-decoration: none;">dilnethmadushanka.online</a>
                    </p>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"Lyntrix Cyber Sentinel" <${gmailUser}>`,
      to: toEmail,
      subject: `[Lyntrix Security] ${otpCode} is your ${isReset ? 'Password Reset' : isChange ? 'Password Change' : 'Account Verification'} Code`,
      html: htmlContent
    });

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      toEmail,
      verifyLink,
      timestamp: new Date().toLocaleTimeString()
    });
  } catch (err) {
    console.error('Nodemailer OTP Error:', err);
    return res.status(500).json({
      error: 'Failed to send OTP email via Nodemailer',
      details: err.message
    });
  }
}
