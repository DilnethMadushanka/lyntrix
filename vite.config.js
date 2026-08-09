import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import nodemailer from 'nodemailer';

function nodemailerDevServer() {
  return {
    name: 'nodemailer-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/send-otp' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const { toEmail, otpCode, purpose = 'Verification' } = parsed;

              const env = loadEnv('', process.cwd(), '');
              const gmailUser = env.GMAIL_USER || env.VITE_GMAIL_USER || 'madsruzza@gmail.com';
              const gmailPass = env.GMAIL_APP_PASSWORD || env.VITE_GMAIL_APP_PASSWORD || 'bcmfyxbytinwmlzm';

              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: gmailUser, pass: gmailPass }
              });

              const isReset = purpose.toLowerCase().includes('reset') || purpose.toLowerCase().includes('forgot');

              const htmlContent = `
                <div style="font-family: Arial, sans-serif; background-color: #07090e; color: #f1f5f9; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid #1e293b;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #38bdf8; font-size: 26px; margin: 0; letter-spacing: 2px;">LYNTRIX</h1>
                    <p style="color: #94a3b8; font-size: 12px; margin-top: 5px;">ENTERPRISE ARCHITECTURE & SECURITY</p>
                  </div>
                  <div style="background-color: #0f172a; padding: 30px; border-radius: 12px; border: 1px solid #334155; text-align: center;">
                    <h2 style="color: #ffffff; font-size: 20px;">
                      ${isReset ? '🔑 Password Reset Verification' : '🔐 2FA Email Verification Code'}
                    </h2>
                    <p style="color: #cbd5e1; font-size: 14px;">Your 6-digit one-time password is:</p>
                    <div style="margin: 25px 0; background: rgba(56, 189, 248, 0.1); padding: 18px; border-radius: 12px; border: 1px dashed #38bdf8; display: inline-block;">
                      <span style="font-family: monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #38bdf8;">
                        ${otpCode}
                      </span>
                    </div>
                    <p style="color: #94a3b8; font-size: 12px;">Valid for 2 minutes. Do not share this code.</p>
                  </div>
                </div>
              `;

              const info = await transporter.sendMail({
                from: `"Lyntrix Security" <${gmailUser}>`,
                to: toEmail,
                subject: `[Lyntrix OTP] ${otpCode} is your ${isReset ? 'Password Reset' : 'Verification'} Code`,
                html: htmlContent
              });

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, messageId: info.messageId, realEmailSent: true }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if (req.url === '/api/send-email' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const { type, orderData } = parsed;

              const env = loadEnv('', process.cwd(), '');
              const gmailUser = env.GMAIL_USER || env.VITE_GMAIL_USER || 'madsruzza@gmail.com';
              const gmailPass = env.GMAIL_APP_PASSWORD || env.VITE_GMAIL_APP_PASSWORD || 'bcmfyxbytinwmlzm';

              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: gmailUser, pass: gmailPass }
              });

              let recipient = type === 'admin_alert' ? `admin@lyntrix.tech, ${gmailUser}` : orderData.email;
              let subject = type === 'admin_alert' 
                ? `🚀 [NEW ORDER] Proposal ${orderData.id} - ${orderData.name} (${orderData.service})`
                : `✅ [Proposal Received] Lyntrix IT Services: ${orderData.id} - ${orderData.service}`;

              const info = await transporter.sendMail({
                from: `"Lyntrix Notifications" <${gmailUser}>`,
                to: recipient,
                subject: subject,
                html: `<div style="font-family: Arial; padding: 20px; background: #07090e; color: #fff;"><h3>${subject}</h3><p>Tracking ID: ${orderData.id}</p><p>Budget: ${orderData.budget}</p><p>Details: ${orderData.details}</p></div>`
              });

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, messageId: info.messageId, realEmailSent: true }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nodemailerDevServer()
  ],
  server: {
    port: 3000,
    open: true
  }
});
