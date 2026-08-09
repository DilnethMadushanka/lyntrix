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
    const { toEmail, otpCode, purpose = 'Verification' } = req.body;

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

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #07090e; color: #f1f5f9; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid #1e293b;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #38bdf8; font-size: 26px; margin: 0; letter-spacing: 2px; text-transform: uppercase;">LYNTRIX</h1>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 5px; font-family: monospace;">ENTERPRISE ARCHITECTURE & CLOUD SENTINEL</p>
        </div>

        <div style="background-color: #0f172a; padding: 30px; border-radius: 12px; border: 1px solid #334155; text-align: center;">
          <h2 style="color: #ffffff; font-size: 20px; margin-top: 0;">
            ${isReset ? '🔑 Password Reset Verification' : '🔐 2FA Email Verification Code'}
          </h2>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            ${isReset
              ? 'We received a request to reset your password. Use the secure 6-digit OTP code below to verify your identity and create a new password:'
              : 'Thank you for registering with Lyntrix IT Services. Use the 6-digit one-time password below to authenticate your session:'
            }
          </p>

          <div style="margin: 30px 0; background: linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(99, 102, 241, 0.1)); padding: 20px; border-radius: 12px; border: 1px dashed #38bdf8; display: inline-block;">
            <span style="font-family: monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #38bdf8;">
              ${otpCode}
            </span>
          </div>

          <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">
            ⏳ This code is valid for <strong>2 minutes</strong>. If you did not request this, please ignore this email.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 11px;">
          <p>© ${new Date().getFullYear()} Lyntrix IT Services. All rights reserved.</p>
          <p>Automated Security Notification • <a href="https://dilnethmadushanka.online" style="color: #38bdf8; text-decoration: none;">dilnethmadushanka.online</a></p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Lyntrix Security" <${gmailUser}>`,
      to: toEmail,
      subject: `[Lyntrix OTP] ${otpCode} is your ${isReset ? 'Password Reset' : 'Verification'} Code`,
      html: htmlContent
    });

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      toEmail,
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
