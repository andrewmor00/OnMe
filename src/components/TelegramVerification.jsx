import React, { useState } from 'react';
import telegramBotService from '../utils/telegramBot';

const TelegramVerification = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      setMessage('Please enter a phone number');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = await telegramBotService.requestVerificationCode(
        phoneNumber, 
        null, // userId
        telegramUsername.trim() || null // telegramUsername
      );

      if (result.success) {
        setMessage(`✅ ${result.message}`);
      } else {
        setMessage(`❌ ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setMessage('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = telegramBotService.verifyCode(phoneNumber, verificationCode);
      
      if (result.success) {
        setMessage('✅ Verification successful!');
        setIsVerified(true);
      } else {
        setMessage(`❌ ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="telegram-verification" style={{
      maxWidth: '400px',
      margin: '20px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        🔐 Telegram Verification
      </h2>

      {!isVerified ? (
        <div>
          <form onSubmit={handleRequestCode} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                📱 Phone Number:
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+7 (999) 123-45-67"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                📲 Telegram Username (optional):
              </label>
              <input
                type="text"
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
                placeholder="username (without @)"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
              <small style={{ color: '#666', fontSize: '12px' }}>
                If provided, code will be sent to your Telegram. Otherwise, shown in alert.
              </small>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? '⏳ Sending...' : '📤 Send Verification Code'}
            </button>
          </form>

          <form onSubmit={handleVerifyCode}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                🔢 Verification Code:
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="123456"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? '⏳ Verifying...' : '✅ Verify Code'}
            </button>
          </form>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎉</div>
          <h3 style={{ color: '#28a745' }}>Verification Successful!</h3>
          <p>Your phone number has been verified successfully.</p>
          <button
            onClick={() => {
              setIsVerified(false);
              setPhoneNumber('');
              setTelegramUsername('');
              setVerificationCode('');
              setMessage('');
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Verify Another Number
          </button>
        </div>
      )}

      {message && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          borderRadius: '4px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
        <p>💡 <strong>How it works:</strong></p>
        <p>1. Enter your phone number (for visibility)</p>
        <p>2. Optionally enter your Telegram username</p>
        <p>3. If username provided, code sent to your Telegram</p>
        <p>4. Otherwise, code shown in browser alert</p>
      </div>
    </div>
  );
};

export default TelegramVerification; 