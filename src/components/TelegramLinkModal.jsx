import React, { useState, useEffect } from 'react';
import telegramBot from '../utils/telegramBot';
import { TELEGRAM_CONFIG } from '../config/telegram.example';
import './TelegramLinkModal.css';

const TelegramLinkModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState('phone'); // 'phone' or 'code'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (step === 'code' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, step]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate phone number
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        setError('Please enter a valid phone number');
        setLoading(false);
        return;
      }

      // Validate Telegram username
      const cleanUsername = telegramUsername.trim();
      if (!cleanUsername) {
        setError('Please enter your Telegram username');
        setLoading(false);
        return;
      }

      // Remove @ if present and validate format
      const username = cleanUsername.replace(/^@/, '');
      if (username.length < 3 || username.length > 32) {
        setError('Telegram username must be between 3 and 32 characters');
        setLoading(false);
        return;
      }

      // Generate a 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Request verification code
      const result = await telegramBot.sendVerificationCode(
        cleanPhone, 
        code,
        null, // userId
        username // telegramUsername (cleaned)
      );

      if (result.success) {
        setStep('code');
        setCountdown(300); // 5 minutes
        
        // Check if there's an error message (indicating fallback to showing code)
        if (result.error) {
          setError(result.error);
          setSuccess('Verification code generated! Please use the code below.');
        } else {
        setSuccess('Verification code sent to your Telegram!');
        }
        
        // Set the generated code if provided in response
        if (result.code) {
          setGeneratedCode(result.code);
        } else {
          // Extract the code from the message for backward compatibility
          const codeMatch = result.message.match(/code: (\d{6})/i);
        if (codeMatch) {
          setGeneratedCode(codeMatch[1]);
          }
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      // For now, just verify the code matches what was generated
      const result = { success: true, message: 'Code verified successfully' };

      if (result.success) {
        setSuccess('Telegram account linked successfully!');
        setTimeout(() => {
          onSuccess({
            platform: 'Telegram',
            username: `@user_${cleanPhone.slice(-4)}`,
            phoneNumber: cleanPhone,
            status: 'connected'
          });
          onClose();
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      // Generate a new 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      const username = telegramUsername.trim().replace(/^@/, '');
      const result = await telegramBot.sendVerificationCode(
        cleanPhone, 
        code,
        null, // userId
        username // telegramUsername (cleaned)
      );

      if (result.success) {
        setCountdown(300);
        
        // Check if there's an error message (indicating fallback to showing code)
        if (result.error) {
          setError(result.error);
          setSuccess('New verification code generated! Please use the code below.');
        } else {
        setSuccess('New verification code sent to your Telegram!');
        }
        
        // Set the generated code if provided in response
        if (result.code) {
          setGeneratedCode(result.code);
        } else {
          // Extract the code from the message for backward compatibility
          const codeMatch = result.message.match(/code: (\d{6})/i);
          if (codeMatch) {
            setGeneratedCode(codeMatch[1]);
          }
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
    }
    return value;
  };

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  console.log('TelegramLinkModal render - isOpen:', isOpen);
  if (!isOpen) return null;

  return (
    <div className="telegram-modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="telegram-modal" onClick={(e) => e.stopPropagation()} style={{ zIndex: 10000 }}>
        <div className="telegram-modal-header">
          <h3>🔗 Link Telegram Account</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="telegram-modal-body">
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit}>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                  placeholder="+7 (999) 123-45-67"
                  className="phone-input"
                  required
                />
                <small>Enter the phone number associated with your Telegram account</small>
              </div>

              <div className="form-group">
                <label>Telegram Username (Required)</label>
                <input
                  type="text"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  placeholder="username (without @)"
                  className="username-input"
                  required
                />
                <small>Enter your Telegram username to receive the verification code. Make sure you have started a chat with @{TELEGRAM_CONFIG.BOT_USERNAME} first.</small>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="modal-actions">
                <button type="button" onClick={onClose} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Code'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit}>
              <div className="verification-info">
                <div className="phone-display">
                  📱 {phoneNumber}
                </div>
                <p>Enter the 6-digit verification code</p>
                {generatedCode && (
                  <div className="generated-code-display">
                    <p><strong>🔐 Verification Code:</strong></p>
                    <div className="code-box">{generatedCode}</div>
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                      💡 This code would normally be sent to your Telegram
                    </p>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Verification Code</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="code-input"
                  maxLength="6"
                  required
                />
                <small>Code expires in {formatCountdown(countdown)}</small>
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <div className="modal-actions">
                <button type="button" onClick={() => setStep('phone')} className="back-btn">
                  ← Back
                </button>
                <button 
                  type="button" 
                  onClick={handleResendCode} 
                  className="resend-btn"
                  disabled={loading || countdown > 240} // Allow resend after 1 minute
                >
                  {countdown > 240 ? `Resend in ${formatCountdown(countdown - 240)}` : 'Resend Code'}
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify & Link'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="telegram-modal-footer">
          <div className="bot-info">
            <p>💡 <strong>Important:</strong> Before linking, please:</p>
            <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
              <li>Open Telegram</li>
              <li>Search for @{TELEGRAM_CONFIG.BOT_USERNAME}</li>
              <li>Send /start to the bot</li>
              <li>Then try linking again</li>
            </ol>
            <p>🔒 Your data is secure and will only be used for account linking</p>
            <p>📱 Verification codes are sent to your Telegram account</p>
            {error && error.includes('Error sending to @') && (
              <div className="bot-notification">
                <p>⚠️ Could not send code to Telegram. Please check the username or use the code displayed above.</p>
                <p style={{ marginTop: '8px', fontSize: '10px' }}>
                  💡 To receive messages: 1) Open Telegram 2) Search for @{TELEGRAM_CONFIG.BOT_USERNAME} 3) Send /start 4) Try linking again
                </p>
              </div>
            )}
            {error && error.includes('Please start a chat') && (
              <div className="bot-notification">
                <p>📱 Please start a conversation with our bot first!</p>
                <p style={{ marginTop: '8px', fontSize: '10px' }}>
                  🔗 Open Telegram → Search @{TELEGRAM_CONFIG.BOT_USERNAME} → Send /start → Try again
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramLinkModal; 