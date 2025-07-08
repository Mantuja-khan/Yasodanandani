import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Check if credentials are provided
const checkCredentials = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('⚠️  Gmail credentials not configured. Email features will be disabled.');
    console.warn('Please set GMAIL_USER and GMAIL_APP_PASSWORD in your .env file');
    console.warn('📧 Current GMAIL_USER:', process.env.GMAIL_USER || 'NOT SET');
    console.warn('📧 Current GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? 'SET (length: ' + process.env.GMAIL_APP_PASSWORD.length + ')' : 'NOT SET');
    return false;
  }
  
  // Check if app password looks correct (should be 16 characters)
  const appPassword = process.env.GMAIL_APP_PASSWORD.replace(/\s/g, ''); // Remove spaces
  if (appPassword.length !== 16) {
    console.warn('⚠️  Gmail App Password appears to be incorrect length.');
    console.warn('Expected: 16 characters (like: abcd efgh ijkl mnop)');
    console.warn('Current length:', appPassword.length);
    return false;
  }
  
  return true;
};

let transporter = null;

// Only create transporter if credentials are available
if (checkCredentials()) {
  // Remove spaces from app password for authentication
  const cleanAppPassword = process.env.GMAIL_APP_PASSWORD.replace(/\s/g, '');
  
  transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.GMAIL_USER,
      pass: cleanAppPassword
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Verify transporter configuration
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Email transporter verification failed:', error.message);
      console.error('Please check your Gmail credentials in .env file');
      console.error('Make sure you are using Gmail App Password, not your regular password');
      console.error('📧 Gmail Account:', process.env.GMAIL_USER);
      console.error('📧 App Password Length:', process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.replace(/\s/g, '').length : 0);
      
      // Provide specific error guidance
      if (error.code === 'EAUTH') {
        console.error('');
        console.error('🔧 AUTHENTICATION ERROR - Follow these steps:');
        console.error('1. Go to https://myaccount.google.com/');
        console.error('2. Login with:', process.env.GMAIL_USER);
        console.error('3. Go to Security → 2-Step Verification (enable if not enabled)');
        console.error('4. Go to Security → App passwords');
        console.error('5. Generate new app password for "Mail"');
        console.error('6. Copy the 16-character password to GMAIL_APP_PASSWORD in .env');
        console.error('7. Restart your server');
        console.error('');
      }
    } else {
      console.log('✅ Email transporter is ready to send messages');
      console.log('📧 Gmail Account:', process.env.GMAIL_USER);
      console.log('📧 SMTP Configuration: Verified');
    }
  });
} else {
  console.log('📧 Email service disabled - credentials not configured');
  console.log('');
  console.log('🔧 TO ENABLE EMAIL SERVICE:');
  console.log('1. Go to https://myaccount.google.com/');
  console.log('2. Login with: mantujak@gmail.com');
  console.log('3. Enable 2-Factor Authentication');
  console.log('4. Generate App Password for Mail');
  console.log('5. Update .env file with the 16-character password');
  console.log('6. Restart server');
  console.log('');
}

export const sendOTP = async (email, otp) => {
  if (!transporter) {
    throw new Error('Email service not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env file');
  }

  try {
    const mailOptions = {
      from: {
        name: 'ShopEase',
        address: process.env.GMAIL_USER
      },
      to: email,
      subject: 'Email Verification OTP - ShopEase',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 20px; border-radius: 10px;">
              <h1 style="margin: 0; font-size: 28px;">🛍️ ShopEase</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Your Online Shopping Destination</p>
            </div>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1f2937; margin-bottom: 20px; text-align: center; font-size: 24px;">📧 Email Verification</h2>
            <p style="color: #4b5563; margin-bottom: 30px; font-size: 16px; text-align: center; line-height: 1.6;">
              Welcome to ShopEase! Please use the following OTP to verify your email address and complete your registration:
            </p>
            
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">
              <p style="margin: 0 0 10px 0; font-size: 14px; opacity: 0.9;">Your Verification Code</p>
              <h1 style="margin: 0; font-size: 42px; letter-spacing: 8px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${otp}</h1>
            </div>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 25px 0;">
              <p style="color: #92400e; font-weight: 600; margin: 0; text-align: center; font-size: 14px;">
                ⏰ This OTP will expire in 10 minutes
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                If you didn't request this verification, please ignore this email.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} ShopEase. All rights reserved.
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
              This email was sent from: ${process.env.GMAIL_USER}
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully:', info.messageId);
    console.log('📧 From:', process.env.GMAIL_USER);
    console.log('📧 To:', email);
    console.log('📧 OTP:', otp);
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    
    // Provide specific error guidance
    if (error.code === 'EAUTH') {
      console.error('');
      console.error('🔧 AUTHENTICATION ERROR:');
      console.error('- Check if you are using Gmail App Password (not regular password)');
      console.error('- Verify 2-Factor Authentication is enabled');
      console.error('- Generate new App Password if needed');
      console.error('- Current Gmail User:', process.env.GMAIL_USER);
      console.error('');
    } else if (error.code === 'ENOTFOUND') {
      console.error('');
      console.error('🔧 NETWORK ERROR:');
      console.error('- Check your internet connection');
      console.error('- Verify SMTP settings');
      console.error('');
    }
    
    throw new Error('Failed to send OTP email. Please check your email configuration.');
  }
};

export const sendPasswordResetOTP = async (email, otp, userName) => {
  if (!transporter) {
    throw new Error('Email service not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env file');
  }

  try {
    const mailOptions = {
      from: {
        name: 'ShopEase',
        address: process.env.GMAIL_USER
      },
      to: email,
      subject: 'Password Reset OTP - ShopEase',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 20px; border-radius: 10px;">
              <h1 style="margin: 0; font-size: 28px;">🔒 ShopEase</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Password Reset Request</p>
            </div>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1f2937; margin-bottom: 20px; text-align: center; font-size: 24px;">🔑 Password Reset</h2>
            <p style="color: #4b5563; margin-bottom: 30px; font-size: 16px; text-align: center; line-height: 1.6;">
              Hello ${userName}, we received a request to reset your password. Use the following OTP to reset your password:
            </p>
            
            <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);">
              <p style="margin: 0 0 10px 0; font-size: 14px; opacity: 0.9;">Your Reset Code</p>
              <h1 style="margin: 0; font-size: 42px; letter-spacing: 8px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${otp}</h1>
            </div>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 25px 0;">
              <p style="color: #92400e; font-weight: 600; margin: 0; text-align: center; font-size: 14px;">
                ⏰ This OTP will expire in 10 minutes
              </p>
            </div>
            
            <div style="background: #fee2e2; border: 1px solid #ef4444; padding: 15px; border-radius: 8px; margin: 25px 0;">
              <p style="color: #dc2626; font-weight: 600; margin: 0; text-align: center; font-size: 14px;">
                🚨 If you didn't request this password reset, please ignore this email and your password will remain unchanged.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} ShopEase. All rights reserved.
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
              This email was sent from: ${process.env.GMAIL_USER}
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset OTP email sent successfully:', info.messageId);
    console.log('📧 From:', process.env.GMAIL_USER);
    console.log('📧 To:', email);
    console.log('📧 OTP:', otp);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset OTP email:', error);
    throw new Error('Failed to send password reset OTP email. Please check your email configuration.');
  }
};

export const sendOrderConfirmation = async (email, orderDetails) => {
  if (!transporter) {
    console.warn('Email service not configured, skipping order confirmation email');
    return;
  }

  try {
    const mailOptions = {
      from: {
        name: 'ShopEase',
        address: process.env.GMAIL_USER
      },
      to: email,
      subject: `Order Confirmation - #${orderDetails.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3b82f6; margin: 0;">ShopEase</h1>
            <p style="color: #666; margin: 5px 0;">Order Confirmation</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 10px;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Thank you for your order!</h2>
            <p style="color: #4b5563; margin-bottom: 20px;">
              Your order has been confirmed and is being processed.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-bottom: 15px;">Order Details</h3>
              <p><strong>Order ID:</strong> #${orderDetails.orderId}</p>
              <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
              <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              You will receive another email when your order ships.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px;">
              © ${new Date().getFullYear()} ShopEase. All rights reserved.
            </p>
            <p style="color: #9ca3af; font-size: 12px;">
              Sent from: ${process.env.GMAIL_USER}
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent successfully');
    console.log('📧 From:', process.env.GMAIL_USER);
    console.log('📧 To:', email);
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
  }
};

// Test email function for debugging
export const testEmailConfiguration = async () => {
  if (!transporter) {
    return {
      success: false,
      message: 'Email service not configured',
      details: {
        gmail_user: process.env.GMAIL_USER || 'NOT SET',
        gmail_app_password: process.env.GMAIL_APP_PASSWORD ? 'SET' : 'NOT SET',
        app_password_length: process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.replace(/\s/g, '').length : 0,
        instructions: [
          '1. Go to https://myaccount.google.com/',
          '2. Login with mantujak@gmail.com',
          '3. Enable 2-factor authentication',
          '4. Go to Security → App passwords',
          '5. Generate a new app password for Mail',
          '6. Use this 16-character password in GMAIL_APP_PASSWORD'
        ]
      }
    };
  }

  try {
    await transporter.verify();
    
    // Send a test email
    const testMailOptions = {
      from: {
        name: 'ShopEase Test',
        address: process.env.GMAIL_USER
      },
      to: process.env.GMAIL_USER, // Send to self
      subject: 'ShopEase Email Configuration Test ✅',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f9ff;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 15px; text-align: center;">
            <h2 style="margin: 0; font-size: 28px;">✅ Email Configuration Test Successful!</h2>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 15px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              🎉 Congratulations! Your Gmail SMTP configuration is working correctly.
            </p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-bottom: 15px;">📋 Configuration Details:</h3>
              <p style="margin: 5px 0;"><strong>Gmail Account:</strong> ${process.env.GMAIL_USER}</p>
              <p style="margin: 5px 0;"><strong>SMTP Host:</strong> smtp.gmail.com</p>
              <p style="margin: 5px 0;"><strong>Port:</strong> 587</p>
              <p style="margin: 5px 0;"><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="background: #d1fae5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #065f46; font-weight: bold; margin: 0; text-align: center;">
                🚀 Your email service is now ready to send OTPs and notifications!
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(testMailOptions);
    
    return {
      success: true,
      message: 'Email configuration is working correctly! Test email sent.',
      details: {
        gmail_user: process.env.GMAIL_USER,
        smtp_host: 'smtp.gmail.com',
        smtp_port: 587,
        status: 'verified',
        test_email_sent: true,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      success: false,
      message: 'Email configuration error',
      error: error.message,
      details: {
        gmail_user: process.env.GMAIL_USER,
        error_code: error.code,
        suggestions: [
          'Check if GMAIL_APP_PASSWORD is correct (16 characters)',
          'Make sure 2-factor authentication is enabled',
          'Verify the Gmail account exists and is active',
          'Generate a new App Password if needed',
          'Restart the server after updating .env'
        ]
      }
    };
  }
};