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
    const { type, orderData } = req.body;

    if (!orderData) {
      return res.status(400).json({ error: 'orderData is required' });
    }

    const gmailUser = process.env.GMAIL_USER || process.env.VITE_GMAIL_USER || 'lyntrixtec@gmail.com';
    const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.VITE_GMAIL_APP_PASSWORD || 'kloq udzy vkyo spyk';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });

    let subject = '';
    let htmlContent = '';
    let recipient = '';

    if (type === 'admin_alert') {
      recipient = 'admin@lyntrixtec.com, ' + gmailUser;
      subject = `⚡ [NEW PROPOSAL DISPATCH] ${orderData.id} - ${orderData.name} (${orderData.service})`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 0; background-color: #05070B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #05070B; padding: 40px 15px;">
            <tr>
              <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background: #0A0E17; border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
                  
                  <tr><td height="4" style="background: linear-gradient(90deg, #00F0FF, #3B82F6, #10B981);"></td></tr>

                  <tr>
                    <td style="padding: 30px 40px 10px 40px; text-align: center;">
                      <div style="display: inline-block; padding: 8px 16px; background: rgba(0, 240, 255, 0.08); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 10px; margin-bottom: 10px;">
                        <span style="font-family: monospace; font-size: 18px; font-weight: 800; color: #00F0FF;">⚡ LYNTRIX ADMIN DISPATCH</span>
                      </div>
                      <h2 style="color: #FFFFFF; font-size: 22px; margin: 10px 0 5px 0;">New Proposal Inquiry Logged</h2>
                      <p style="color: #64748B; font-size: 11px; font-family: monospace;">REAL-TIME LEAD TELEMETRY</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 20px 40px 30px 40px;">
                      <div style="background: #0E1524; border: 1px solid #1E293B; border-radius: 14px; padding: 25px;">
                        
                        <table width="100%" border="0" cellspacing="0" cellpadding="8" style="font-size: 13px; font-family: monospace;">
                          <tr>
                            <td style="color: #64748B; width: 35%;">Tracking ID:</td>
                            <td style="color: #00F0FF; font-weight: bold; font-size: 15px;">${orderData.id}</td>
                          </tr>
                          <tr>
                            <td style="color: #64748B;">Client Name:</td>
                            <td style="color: #FFFFFF; font-weight: bold;">${orderData.name}</td>
                          </tr>
                          <tr>
                            <td style="color: #64748B;">Corporate Email:</td>
                            <td style="color: #38BDF8;">${orderData.email}</td>
                          </tr>
                          <tr>
                            <td style="color: #64748B;">Phone / Hotline:</td>
                            <td style="color: #CBD5E1;">${orderData.phone || 'N/A'}</td>
                          </tr>
                          <tr>
                            <td style="color: #64748B;">Service Area:</td>
                            <td style="color: #FFFFFF; font-weight: bold;">${orderData.service}</td>
                          </tr>
                          <tr>
                            <td style="color: #64748B;">Architecture Scale:</td>
                            <td style="color: #A78BFA;">${orderData.scale || 'Enterprise'}</td>
                          </tr>
                          <tr>
                            <td style="color: #64748B;">Estimated Budget:</td>
                            <td style="color: #10B981; font-weight: bold; font-size: 15px;">${orderData.budget}</td>
                          </tr>
                        </table>

                        <div style="margin-top: 15px; padding: 15px; background: #07090E; border: 1px solid #1E293B; border-radius: 10px;">
                          <div style="color: #64748B; font-size: 10px; text-transform: uppercase; margin-bottom: 5px; font-family: monospace;">Client Requirements:</div>
                          <p style="color: #E2E8F0; font-size: 12px; line-height: 1.6; margin: 0; font-family: sans-serif;">${orderData.details}</p>
                        </div>

                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 20px 40px 30px 40px; border-top: 1px solid #1E293B; text-align: center; color: #475569; font-size: 11px; font-family: monospace;">
                      © ${new Date().getFullYear()} Lyntrix IT Services Sentinel.
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
    } else {
      // Client order confirmation
      recipient = orderData.email;
      subject = `✅ [Proposal Received & Accepted] Lyntrix IT Services: ${orderData.id} - ${orderData.service}`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 0; background-color: #05070B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #05070B; padding: 40px 15px;">
            <tr>
              <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background: #0A0E17; border: 1px solid rgba(0, 240, 255, 0.25); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
                  
                  <tr><td height="4" style="background: linear-gradient(90deg, #10B981, #00F0FF, #3B82F6);"></td></tr>

                  <tr>
                    <td style="padding: 35px 40px 15px 40px; text-align: center;">
                      <div style="display: inline-block; padding: 10px 18px; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; margin-bottom: 12px;">
                        <span style="font-family: monospace; font-size: 18px; font-weight: 800; color: #10B981;">⚡ PROPOSAL ACCEPTED</span>
                      </div>
                      <h2 style="color: #FFFFFF; font-size: 22px; margin: 10px 0 5px 0;">Technical Proposal Received</h2>
                      <p style="color: #64748B; font-size: 11px; font-family: monospace;">LYNTRIX ENTERPRISE ADVISORY</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 10px 40px 30px 40px;">
                      <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">
                        Dear <strong>${orderData.name}</strong>,<br><br>
                        Thank you for choosing <strong>Lyntrix IT Services</strong>. Your project proposal for <strong>${orderData.service}</strong> has been successfully accepted and assigned to our Senior Solutions Architecture Team.
                      </p>

                      <div style="background: #0E1524; border: 1px solid #1E293B; border-radius: 14px; padding: 20px; margin: 20px 0;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="6" style="font-size: 13px; font-family: monospace;">
                          <tr>
                            <td style="color: #64748B; width: 40%;">Proposal Tracking ID:</td>
                            <td style="color: #00F0FF; font-weight: bold;">${orderData.id}</td>
                          </tr>
                          <tr>
                            <td style="color: #64748B;">Target Service:</td>
                            <td style="color: #FFFFFF; font-weight: bold;">${orderData.service}</td>
                          </tr>
                          <tr>
                            <td style="color: #64748B;">Estimated Budget:</td>
                            <td style="color: #10B981; font-weight: bold;">${orderData.budget}</td>
                          </tr>
                          <tr>
                            <td style="color: #64748B;">Status:</td>
                            <td style="color: #10B981; font-weight: bold;">Order Accepted & Discovery Scoped</td>
                          </tr>
                        </table>
                      </div>

                      <p style="color: #94A3B8; font-size: 13px; line-height: 1.6;">
                        Our Senior Architecture Lead will review your technical specifications and contact you within <strong>24 business hours</strong> to coordinate our discovery session.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 20px 40px 30px 40px; border-top: 1px solid #1E293B; text-align: center;">
                      <p style="margin: 0 0 5px 0; color: #475569; font-size: 11px; font-family: monospace;">
                        © ${new Date().getFullYear()} LYNTRIX IT SERVICES. All rights reserved.
                      </p>
                      <p style="margin: 0; color: #64748B; font-size: 11px;">
                        Enterprise Architecture • <a href="https://lyntrixtec.com" style="color: #00F0FF; text-decoration: none;">lyntrixtec.com</a>
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
    }

    const info = await transporter.sendMail({
      from: `"Lyntrix Enterprise" <${gmailUser}>`,
      to: recipient,
      subject: subject,
      html: htmlContent
    });

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      recipient,
      timestamp: new Date().toLocaleTimeString()
    });
  } catch (err) {
    console.error('Nodemailer Email Error:', err);
    return res.status(500).json({
      error: 'Failed to send email via Nodemailer',
      details: err.message
    });
  }
}
