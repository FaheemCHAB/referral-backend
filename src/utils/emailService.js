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
 * Sends welcome email with credentials to a newly created user
 * @param {Object} user - User object containing email, username and other details
 * @returns {Promise} - Promise resolving to email send information
 */
const sendWelcomeEmail = async (user) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: '🎉 Welcome aboard, ' + user.name + '! Your ReferNrich journey begins now',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
          
          <!-- Celebration Animation Background -->
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 200px; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:%23ff6b6b;stop-opacity:0.3" /><stop offset="50%" style="stop-color:%2340e0d0;stop-opacity:0.3" /><stop offset="100%" style="stop-color:%2340e0d0;stop-opacity:0.3" /></linearGradient></defs><path fill="url(%23grad)" d="M0,96L48,80C96,64,192,32,288,37.3C384,43,480,85,576,90.7C672,96,768,64,864,58.7C960,53,1056,75,1152,74.7C1200,75,1248,53,1296,58.7L1344,64L1344,0L1296,0C1248,0,1152,0,1056,0C960,0,864,0,768,0C672,0,576,0,480,0C384,0,288,0,192,0C96,0,48,0,24,0L0,0Z"></path></svg></div>
          
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px; margin: 40px auto; position: relative; z-index: 1;">
            
            <!-- Floating Welcome Card -->
            <tr>
              <td style="padding: 0 20px;">
                <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); transform: translateY(0); transition: transform 0.3s ease;">
                  
                  <!-- Celebration Header with Confetti -->
                  <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 50%, #ff6b9d 100%); padding: 40px 40px 60px 40px; text-align: center; position: relative; overflow: hidden;">
                    <!-- Confetti Elements -->
                    <div style="position: absolute; top: 10px; left: 20%; width: 10px; height: 10px; background: #FFD700; border-radius: 50%; opacity: 0.8;"></div>
                    <div style="position: absolute; top: 30px; right: 15%; width: 8px; height: 8px; background: #FF69B4; border-radius: 50%; opacity: 0.7;"></div>
                    <div style="position: absolute; top: 20px; left: 70%; width: 6px; height: 20px; background: #00CED1; border-radius: 3px; opacity: 0.8;"></div>
                    <div style="position: absolute; top: 45px; right: 40%; width: 12px; height: 4px; background: #32CD32; border-radius: 2px; opacity: 0.9;"></div>
                    
                    <div style="font-size: 60px; margin-bottom: 15px;">🎉</div>
                    <h1 style="color: white; margin: 0 0 10px 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                      Welcome to ReferNrich!
                    </h1>
                    <p style="color: rgba(255,255,255,0.9); font-size: 18px; margin: 0; font-weight: 300;">
                      Your journey to success starts here, ${user.name}! ✨
                    </p>
                  </div>
                  
                  <!-- Main Content -->
                  <div style="padding: 50px 40px;">
                    
                    <!-- Personal Greeting -->
                    <div style="text-align: center; margin-bottom: 40px;">
                      <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);">
                        <span style="font-size: 32px; color: white;">👋</span>
                      </div>
                      <h2 style="color: #2d3748; font-size: 24px; font-weight: 600; margin: 0 0 10px 0;">
                        Hello ${user.name}!
                      </h2>
                      <p style="color: #718096; font-size: 16px; margin: 0; line-height: 1.6;">
                        We're absolutely thrilled to have you join our community! 🚀<br>
                        Your account is ready and waiting for you to explore all the amazing features.
                      </p>
                    </div>
                    
                    <!-- Credentials Card with Enhanced Design -->
                    <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 2px solid #e2e8f0; border-radius: 16px; padding: 30px; margin: 30px 0; position: relative; overflow: hidden;">
                      <div style="position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; opacity: 0.1;"></div>
                      
                      <div style="display: flex; align-items: center; margin-bottom: 20px;">
                        <div style="background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%); width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                          <span style="color: white; font-size: 20px;">🔑</span>
                        </div>
                        <h3 style="color: #2d3748; font-size: 20px; font-weight: 600; margin: 0;">
                          Your Login Credentials
                        </h3>
                      </div>
                      
                      <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                        <div style="margin-bottom: 15px;">
                          <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <span style="color: #4a5568; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Username</span>
                          </div>
                          <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; font-family: 'Monaco', monospace; font-size: 16px; color: #2d3748; font-weight: 500;">
                            ${user.username}
                          </div>
                        </div>
                        
                        <div>
                          <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <span style="color: #4a5568; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Password</span>
                          </div>
                          <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; font-family: 'Monaco', monospace; font-size: 16px; color: #2d3748; font-weight: 500;">
                            ${user.password}
                          </div>
                        </div>
                      </div>
                      
                      <div style="background: #bee3f8; border-radius: 8px; padding: 15px; margin-top: 20px; border-left: 4px solid #3182ce;">
                        <p style="color: #2c5282; font-size: 14px; margin: 0; display: flex; align-items: center;">
                          <span style="margin-right: 8px;">💡</span>
                          Access your account using the credentials above.
                        </p>
                      </div>
                    </div>
                    
                    <!-- Enhanced CTA Button -->
                    <div style="text-align: center; margin: 40px 0;">
                      <div style="margin-bottom: 20px;">
                        <p style="color: #4a5568; font-size: 16px; margin: 0; font-weight: 500;">
                          Ready to dive in? Let's get started! 🌟
                        </p>
                      </div>
                      <a href="${process.env.REDIRECT_URL}" style="background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: 600; display: inline-block; font-size: 18px; box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3); transition: all 0.3s ease; border: none; cursor: pointer;">
                        🚀 Launch My Account
                      </a>
                      <p style="color: #718096; font-size: 14px; margin: 15px 0 0 0;">
                        Click above to access your personalized dashboard
                      </p>
                    </div>
                    
                    <!-- Quick Start Guide -->
                    <div style="background: #f0fff4; border: 1px solid #9ae6b4; border-radius: 12px; padding: 25px; margin: 30px 0;">
                      <h4 style="color: #22543d; font-size: 18px; font-weight: 600; margin: 0 0 15px 0; display: flex; align-items: center;">
                        <span style="margin-right: 10px;">📋</span>
                        Quick Start Guide
                      </h4>
                      <div style="color: #2f855a; font-size: 15px; line-height: 1.8;">
                        <div style="margin-bottom: 8px;">✅ Log in with your credentials above</div>
                        <div style="margin-bottom: 8px;">✅ Explore the dashboard features</div>
                        <div>✅ Start connecting and referring!</div>
                      </div>
                    </div>
                    
                    <!-- Support Section -->
                    <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
                      <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Questions? We're here to help! 🤝<br>
                        Our support team is just a message away and ready to make your experience amazing.
                      </p>
                      
                      <div style="background: linear-gradient(135deg, #805ad5 0%, #553c9a 100%); color: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                        <p style="margin: 0; font-size: 16px; font-weight: 500;">
                          💜 Welcome to the ReferNrich family! 💜
                        </p>
                      </div>
                      
                      <p style="color: #2d3748; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0; font-weight: 500;">
                        Best regards,<br>
                        <span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700; font-size: 18px;">
                          The ReferNrich Team
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            
            <!-- Enhanced Footer -->
            <tr>
              <td style="padding: 30px 20px 40px 20px; text-align: center;">
                <div style="background: rgba(255,255,255,0.9); border-radius: 15px; padding: 25px; backdrop-filter: blur(10px);">
                  <p style="color: #4a5568; font-size: 14px; margin: 0 0 10px 0; font-weight: 500;">
                    © ${new Date().getFullYear()} ReferNrich. Made with ❤️ for our amazing community
                  </p>
                  <p style="color: #718096; font-size: 13px; margin: 0;">
                    This is an automated email, but our support team is always real and ready to help!
                  </p>
                </div>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
  };


  /**
 * Sends a special celebration email when referral status becomes "Joined"
 * @param {Object} referrer - User who made the referral
 * @param {Object} referral - The referral object with "Joined" status
 * @returns {Promise} - Promise resolving to email send information
 */
const sendReferralJoinedCelebrationEmail = async (referrer, referral) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: referrer.email,
      subject: `🎉 Congratulations! ${referral.name} has joined through your referral!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
          
          <!-- Celebration Animation Background -->
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 200px; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:%23ff6b6b;stop-opacity:0.3" /><stop offset="50%" style="stop-color:%2340e0d0;stop-opacity:0.3" /><stop offset="100%" style="stop-color:%2340e0d0;stop-opacity:0.3" /></linearGradient></defs><path fill="url(%23grad)" d="M0,96L48,80C96,64,192,32,288,37.3C384,43,480,85,576,90.7C672,96,768,64,864,58.7C960,53,1056,75,1152,74.7C1200,75,1248,53,1296,58.7L1344,64L1344,0L1296,0C1248,0,1152,0,1056,0C960,0,864,0,768,0C672,0,576,0,480,0C384,0,288,0,192,0C96,0,48,0,24,0L0,0Z"></path></svg></div>
          
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px; margin: 30px auto; position: relative; z-index: 1;">
            
            <!-- Celebration Card -->
            <tr>
              <td style="padding: 0 20px;">
                <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.15);">
                  
                  <!-- Celebration Header -->
                  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center; position: relative; overflow: hidden;">
                    <!-- Confetti Elements -->
                    <div style="position: absolute; top: 15px; left: 20%; width: 10px; height: 10px; background: #FFD700; border-radius: 50%; opacity: 0.8;"></div>
                    <div style="position: absolute; top: 35px; right: 15%; width: 8px; height: 8px; background: #FF69B4; border-radius: 50%; opacity: 0.7;"></div>
                    <div style="position: absolute; top: 25px; left: 70%; width: 6px; height: 20px; background: #00CED1; border-radius: 3px; opacity: 0.8;"></div>
                    <div style="position: absolute; top: 50px; right: 40%; width: 12px; height: 4px; background: #FFD700; border-radius: 2px; opacity: 0.9;"></div>
                    
                    <div style="font-size: 80px; margin-bottom: 20px; animation: bounce 2s infinite;">🎉</div>
                    <h1 style="color: white; margin: 0 0 15px 0; font-size: 32px; font-weight: 700; text-shadow: 0 3px 6px rgba(0,0,0,0.2);">
                      SUCCESS!
                    </h1>
                    <p style="color: rgba(255,255,255,0.95); font-size: 18px; margin: 0; font-weight: 400;">
                      Your referral has joined! 🚀
                    </p>
                  </div>
                  
                  <!-- Main Content -->
                  <div style="padding: 50px 40px;">
                    
                    <!-- Personal Success Message -->
                    <div style="text-align: center; margin-bottom: 40px;">
                      <div style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); width: 80px; height: 80px; border-radius: 50%; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3); display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 36px; color: white;">🏆</span>
                      </div>
                      <h2 style="color: #1f2937; font-size: 28px; font-weight: 700; margin: 0 0 15px 0;">
                        Congratulations, ${referrer.name}!
                      </h2>
                      <p style="color: #6b7280; font-size: 18px; margin: 0; line-height: 1.6;">
                        Your referral <strong style="color: #10b981;">${referral.name}</strong> has officially joined our program! 🎊<br>
                        Thank you for helping us grow our community!
                      </p>
                    </div>
                    
                    <!-- Success Stats -->
                    <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 2px solid #10b981; border-radius: 16px; padding: 30px; margin: 30px 0; text-align: center;">
                      <h3 style="color: #065f46; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">
                        🎯 Referral Success!
                      </h3>
                      <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);">
                        <div style="font-size: 48px; color: #10b981; margin-bottom: 10px;">✅</div>
                        <p style="color: #065f46; font-size: 18px; font-weight: 600; margin: 0;">
                          Status: <span style="color: #10b981;">JOINED</span>
                        </p>
                        <p style="color: #6b7280; font-size: 14px; margin: 10px 0 0 0;">
                          Completed on ${new Date(referral.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <!-- What's Next Section -->
                    <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 12px; padding: 25px; margin: 30px 0;">
                      <h4 style="color: #0c4a6e; font-size: 18px; font-weight: 600; margin: 0 0 15px 0; display: flex; align-items: center;">
                        <span style="margin-right: 10px;">🚀</span>
                        What's Next?
                      </h4>
                      <div style="color: #0369a1; font-size: 15px; line-height: 1.8;">
                        <div style="margin-bottom: 8px;">📈 Track your referral performance in your dashboard</div>
                        <div style="margin-bottom: 8px;">💰 Eligible referrals may qualify for rewards</div>
                        <div>🎯 Keep referring and help more people join our community!</div>
                      </div>
                    </div>
                    
                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 40px 0;">
                      <a href="${process.env.REDIRECT_URL || '#'}" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: 600; display: inline-block; font-size: 18px; box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3); transition: all 0.3s ease;">
                        🎯 View My Dashboard
                      </a>
                    </div>
                    
                    <!-- Thank You Message -->
                    <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                      <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; border-radius: 12px; padding: 25px; margin: 20px 0;">
                        <p style="margin: 0; font-size: 18px; font-weight: 600;">
                          🙏 Thank you for being an amazing referrer!
                        </p>
                        <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">
                          Your efforts help us build a stronger community together
                        </p>
                      </div>
                      
                      <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 25px 0 0 0; font-weight: 500;">
                        With appreciation,<br>
                        <span style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700; font-size: 18px;">
                          The ReferNrich Team
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="padding: 30px 20px 40px 20px; text-align: center;">
                <div style="background: rgba(255,255,255,0.9); border-radius: 15px; padding: 25px; backdrop-filter: blur(10px);">
                  <p style="color: #4b5563; font-size: 14px; margin: 0 0 10px 0; font-weight: 500;">
                    © ${new Date().getFullYear()} ReferNrich. Celebrating your success! 🎉
                  </p>
                  <p style="color: #6b7280; font-size: 13px; margin: 0;">
                    This is an automated celebration email - but our excitement is real!
                  </p>
                </div>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Referral joined celebration email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending referral joined celebration email:', error);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendReferralJoinedCelebrationEmail
};