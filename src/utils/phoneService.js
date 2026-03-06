const axios = require('axios');
require('dotenv').config();

/**
 * Sends welcome message with credentials to a newly created user via Interakt API
 * @param {Object} user - User object containing phone, username, name and other details
 * @returns {Promise} - Promise resolving to Interakt send information
 */
const sendWelcomeMessage = async (user) => {
  try {
    // Validate required fields
    if (!user.phone || !user.username || !user.password) {
      throw new Error('Missing required user fields: phone, username, or password');
    }
   
    // Handle phone number format: +918157070307 or 918157070307
    let phoneNumber = user.phone.toString().trim();
   
    console.log('Processing phone number:', phoneNumber);
   
    // Handle different formats:
    // +918157070307 (13 chars) -> 8157070307
    // 918157070307 (12 chars) -> 8157070307
    // 8157070307 (10 chars) -> 8157070307
    
    if (phoneNumber.startsWith('+91')) {
      phoneNumber = phoneNumber.substring(3); // Remove '+91' prefix
    } else if (phoneNumber.startsWith('91') && phoneNumber.length === 12) {
      phoneNumber = phoneNumber.substring(2); // Remove '91' prefix
    }
   
    // Remove any remaining non-digit characters
    phoneNumber = phoneNumber.replace(/\D/g, '');
   
    // Ensure we have a valid 10-digit Indian mobile number
    if (phoneNumber.length !== 10) {
      throw new Error(`Invalid phone number format. Expected 10 digits, got ${phoneNumber.length}: ${phoneNumber}`);
    }
   
    // Validate that it's a valid Indian mobile number (starts with 6-9)
    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      throw new Error(`Invalid Indian mobile number format: ${phoneNumber}`);
    }
   
    console.log('Original phone:', user.phone);
    console.log('Formatted phone number (10 digits):', phoneNumber);
   
    // Construct the simple message
    const message = `🎉 *Welcome to ReferNrich!*

Hello ${user.name}! 👋

Your account has been created successfully and is ready to use.

*Your Login Credentials:*
📧 Username: ${user.username}
🔑 Password: ${user.password}

🚀 *Access your account here:*
${process.env.REDIRECT_URL || 'https://your-app-url.com'}

*Quick Start:*
✅ Click the link above
✅ Log in with your credentials
✅ Start exploring!

Questions? Our support team is here to help! 🤝

Welcome to the ReferNrich family! 💜

Best regards,
The ReferNrich Team`;

    // Interakt API endpoint
    const url = 'https://api.interakt.ai/v1/public/message/';
   
    const payload = {
      fullPhoneNumber: phoneNumber, // Now contains only 10 digits without country code
      type: "Text",
      data: {
        message: message
      }
    };

    const headers = {
      'Authorization': `Basic ${process.env.INTERAKT_API_KEY}`,
      'Content-Type': 'application/json'
    };

    console.log('Sending message via Interakt to:', phoneNumber);
    console.log('Payload:', JSON.stringify(payload, null, 2));
   
    const response = await axios.post(url, payload, { headers });
   
    console.log('Message sent successfully via Interakt:', response.data);
    return response.data;
   
  } catch (error) {
    console.error('Error sending message via Interakt:', error.response?.data || error.message);
   
    // Log more details for debugging
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
    }
   
    throw error;
  }
};

// Alternative version if Interakt uses different payload structure
// const sendWelcomeMessageAlt = async (user) => {
//   try {
//     // Validate required fields
//     if (!user.phone || !user.username || !user.password) {
//       throw new Error('Missing required user fields: phone, username, or password');
//     }
    
//     // Handle phone number format: +918157070307
//     let phoneNumber = user.phone.toString();
    
//     // Remove the '+91' prefix to get just the 10-digit number
//     if (phoneNumber.startsWith('+91')) {
//       phoneNumber = phoneNumber.substring(3); // Remove '+91' prefix
//     } else if (phoneNumber.startsWith('91')) {
//       phoneNumber = phoneNumber.substring(2); // Remove '91' prefix if no +
//     }
    
//     // Remove any remaining non-digit characters
//     phoneNumber = phoneNumber.replace(/\D/g, '');
    
//     // Ensure we have a valid 10-digit Indian mobile number
//     if (phoneNumber.length !== 10) {
//       throw new Error(`Invalid phone number format. Expected 10 digits, got ${phoneNumber.length}: ${phoneNumber}`);
//     }
    
//     const message = `🎉 *Welcome to ReferNrich!*

// Hello ${user.name}! 👋

// Your account has been created successfully and is ready to use.

// *Your Login Credentials:*
// 📧 Username: ${user.username}
// 🔑 Password: ${user.password}

// 🚀 *Access your account here:*
// ${process.env.REDIRECT_URL || 'https://your-app-url.com'}

// *Quick Start:*
// ✅ Click the link above
// ✅ Log in with your credentials
// ✅ Start exploring!

// Questions? Our support team is here to help! 🤝

// Welcome to the ReferNrich family! 💜

// Best regards,
// The ReferNrich Team`;

//     const url = 'https://api.interakt.ai/v1/public/message/';
    
//     // Alternative payload structure - test which one works
//     const payload = {
//       fullPhoneNumber: `+91${phoneNumber}`, // Now properly formatted with country code
//       callbackData: "welcome_message",
//       type: "text",
//       message: message
//     };

//     const headers = {
//       'Authorization': `Bearer ${process.env.INTERAKT_API_TOKEN}`,
//       'Content-Type': 'application/json'
//     };

//     const response = await axios.post(url, payload, { headers });
//     console.log('Message sent successfully via Interakt (Alt):', response.data);
//     return response.data;
    
//   } catch (error) {
//     console.error('Error sending message via Interakt (Alt):', error.response?.data || error.message);
//     throw error;
//   }
// };

module.exports = {
  sendWelcomeMessage,
  // sendWelcomeMessageAlt
};