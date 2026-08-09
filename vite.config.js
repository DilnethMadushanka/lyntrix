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
              const { toEmail, otpCode, purpose = 'Verification', origin } = parsed;

              const env = loadEnv('', process.cwd(), '');
              const gmailUser = env.GMAIL_USER || env.VITE_GMAIL_USER || 'madsruzza@gmail.com';
              const gmailPass = env.GMAIL_APP_PASSWORD || env.VITE_GMAIL_APP_PASSWORD || 'bcmfyxbytinwmlzm';

              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: gmailUser, pass: gmailPass }
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

              const siteUrl = origin || 'http://localhost:3000';
              const verifyLink = `${siteUrl}/?verify_otp=${otpCode}&email=${encodeURIComponent(toEmail)}&action=${actionType}`;

              const htmlContent = `
                <!DOCTYPE html>
                <html>
                <body style="margin: 0; padding: 0; background-color: #05070B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #05070B; padding: 40px 15px;">
                    <tr>
                      <td align="center">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background: #0A0E17; border: 1px solid rgba(0, 240, 255, 0.25); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);">
                          <tr><td height="4" style="background: linear-gradient(90deg, #00F0FF, #3B82F6, #8B5CF6);"></td></tr>
                          <tr>
                            <td align="center" style="padding: 35px 30px 20px 30px;">
                              <div style="display: inline-block; padding: 10px 18px; background: rgba(0, 240, 255, 0.08); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 12px; margin-bottom: 12px;">
                                <span style="font-family: monospace; font-size: 20px; font-weight: 800; color: #00F0FF; letter-spacing: 2px;">⚡ LYNTRIX</span>
                              </div>
                              <p style="margin: 0; font-size: 11px; font-family: monospace; color: #64748B; letter-spacing: 2px; text-transform: uppercase;">Enterprise Architecture Sentinel</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 40px 30px 40px;">
                              <div style="background: #0E1524; border: 1px solid #1E293B; border-radius: 16px; padding: 30px 25px; text-align: center;">
                                <h2 style="margin: 0 0 10px 0; color: #FFFFFF; font-size: 20px;">${titleText}</h2>
                                <p style="margin: 0 0 20px 0; color: #94A3B8; font-size: 13px; line-height: 1.6;">${descText}</p>
                                
                                <div style="margin: 0 auto 15px auto; background: rgba(0, 240, 255, 0.1); border: 2px dashed #00F0FF; border-radius: 14px; padding: 16px 25px; display: inline-block;">
                                  <span style="font-family: monospace; font-size: 38px; font-weight: 900; letter-spacing: 12px; color: #00F0FF; display: block; margin-left: 12px;">${otpCode}</span>
                                </div>

                                <div style="margin: 0 0 15px 0;">
                                  <span style="color: #64748B; font-size: 11px; font-family: monospace;">— OR CLICK LINK TO VERIFY DIRECTLY —</span>
                                </div>

                                <div style="margin-bottom: 20px;">
                                  <a href="${verifyLink}" target="_blank" style="display: inline-block; background: linear-gradient(90deg, #00F0FF 0%, #3B82F6 100%); color: #07090E; font-size: 13px; font-weight: 800; font-family: monospace; text-decoration: none; padding: 14px 28px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 240, 255, 0.35); text-transform: uppercase;">
                                    ⚡ 1-Click Instant Verify & Continue →
                                  </a>
                                </div>

                                <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(51, 65, 85, 0.6); border-radius: 10px; padding: 10px; font-size: 11px; font-family: monospace; color: #64748B;">
                                  ⏱️ Valid for: <strong style="color: #E2E8F0;">2 Minutes</strong> • Recipient: <strong style="color: #00F0FF;">${toEmail}</strong>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 20px 40px 30px 40px; border-top: 1px solid #1E293B; text-align: center; color: #475569; font-size: 11px; font-family: monospace;">
                              © ${new Date().getFullYear()} LYNTRIX IT SERVICES • dilnethmadushanka.online
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
                from: `"Lyntrix Security" <${gmailUser}>`,
                to: toEmail,
                subject: `[Lyntrix Security] ${otpCode} is your ${isReset ? 'Password Reset' : isChange ? 'Password Change' : 'Verification'} Code`,
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
                ? `⚡ [NEW PROPOSAL] ${orderData.id} - ${orderData.name} (${orderData.service})`
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
