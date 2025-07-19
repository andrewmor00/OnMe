import React, { useState, useEffect } from 'react';
import telegramBotService from '../utils/telegramBot';
import { TELEGRAM_CONFIG } from '../config/telegram.example';

const TelegramTest = () => {
  const [botInfo, setBotInfo] = useState(null);
  const [testCode, setTestCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  useEffect(() => {
    testBotConnection();
  }, []);

  const testBotConnection = async () => {
    try {
      const info = await telegramBotService.getBotInfo();
      setBotInfo(info);
      setResult(`✅ Bot connected successfully!\nName: ${info.first_name}\nUsername: @${info.username}`);
    } catch (error) {
      setResult(`❌ Bot connection failed: ${error.message}`);
    }
  };

  const testCodeGeneration = async () => {
    setLoading(true);
    try {
      const result = await telegramBotService.requestVerificationCode('1234567890', 'test_user');
      setResult(`🔐 Test result: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setResult(`❌ Test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testCodeVerification = () => {
    const result = telegramBotService.verifyCode('1234567890', testCode);
    setResult(`🔍 Verification result: ${JSON.stringify(result, null, 2)}`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🤖 Telegram Bot Test</h2>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Bot Configuration</h3>
        <p><strong>Token:</strong> {TELEGRAM_CONFIG.BOT_TOKEN.substring(0, 20)}...</p>
        <p><strong>Username:</strong> @{TELEGRAM_CONFIG.BOT_USERNAME}</p>
        <p><strong>Name:</strong> {TELEGRAM_CONFIG.BOT_NAME}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Bot Connection Test</h3>
        {botInfo ? (
          <div style={{ color: 'green', padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
            ✅ Connected to @{botInfo.username} ({botInfo.first_name})
          </div>
        ) : (
          <div style={{ color: 'red', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
            ❌ Not connected
          </div>
        )}
        <button onClick={testBotConnection} style={{ marginTop: '10px', padding: '8px 16px' }}>
          Test Connection
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Code Generation Test</h3>
        <button 
          onClick={testCodeGeneration} 
          disabled={loading}
          style={{ padding: '8px 16px', marginBottom: '10px' }}
        >
          {loading ? 'Testing...' : 'Generate Test Code'}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Code Verification Test</h3>
        <input
          type="text"
          value={testCode}
          onChange={(e) => setTestCode(e.target.value)}
          placeholder="Enter test code"
          style={{ padding: '8px', marginRight: '10px', width: '150px' }}
        />
        <button onClick={testCodeVerification} style={{ padding: '8px 16px' }}>
          Verify Code
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Test Results</h3>
        <pre style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '4px', 
          whiteSpace: 'pre-wrap',
          fontSize: '12px'
        }}>
          {result}
        </pre>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '8px' }}>
        <h3>📱 How to Test</h3>
        <ol>
          <li>Click "Generate Test Code" to create a verification code</li>
          <li>Check the browser console for the generated code</li>
          <li>Copy the code and paste it in the verification test</li>
          <li>Click "Verify Code" to test the verification process</li>
        </ol>
        <p><strong>Note:</strong> This is a test environment. In production, codes would be sent via Telegram messages.</p>
      </div>
    </div>
  );
};

export default TelegramTest; 