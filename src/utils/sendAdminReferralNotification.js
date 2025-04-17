const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure your email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or another email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Sends notification email to admin when a new referral is created
 * @param {Object} referral - Referral object containing name, mobile and other details
 * @param {String} adminEmail - Admin's email address
 * @returns {Promise} - Promise resolving to email send information
 */
const sendAdminReferralNotification = async (referral, adminEmail) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: 'New Referral Notification - ReferNrich',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
            <!-- Header -->
            <tr>
              <td style="background-color: #5C6BC0; padding: 30px 40px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">New Referral Alert!</h1>
              </td>
            </tr>
            
            <!-- Body Content -->
            <tr>
              <td style="padding: 40px;">
                <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 0;">Hello Admin,</p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">A new referral has been added to the ReferNrich system.</p>
                
                <!-- Referral Details Box -->
                <div style="background-color: #f5f7fd; border-left: 4px solid #5C6BC0; padding: 20px; margin: 25px 0; border-radius: 4px;">
                  <h3 style="color: #333; font-size: 18px; margin-top: 0; margin-bottom: 15px;">Referral Details</h3>
                  <p style="color: #555; font-size: 16px; margin: 8px 0;">
                    <span style="font-weight: 600; color: #444;">Name:</span> ${referral.name}
                  </p>
                  <p style="color: #555; font-size: 16px; margin: 8px 0;">
                    <span style="font-weight: 600; color: #444;">Mobile:</span> ${referral.mobile}
                  </p>
                  ${referral.email ? `
                  <p style="color: #555; font-size: 16px; margin: 8px 0;">
                    <span style="font-weight: 600; color: #444;">Email:</span> ${referral.email}
                  </p>` : ''}
                </div>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.ADMIN_DASHBOARD_URL}" style="background-color: #5C6BC0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 600; display: inline-block; font-size: 16px;">View in Dashboard</a>
                </div>
                
                <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                  Best regards,<br>
                  <span style="color: #5C6BC0; font-weight: 600;">The ReferNrich Team</span>
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color: #f2f2f2; padding: 20px; text-align: center; color: #777; font-size: 14px;">
                <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} ReferNrich. All rights reserved.</p>
                <p style="margin: 0;">This is an automated email, please do not reply.</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    throw error;
  }
};

module.exports = {
  sendAdminReferralNotification
};