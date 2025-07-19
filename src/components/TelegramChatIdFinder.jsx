import React, { useState } from 'react';
import telegramBot from '../utils/telegramBot';
import './TelegramChatIdFinder.css';

const TelegramChatIdFinder = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const findChatId = async () => {
    setLoading(true);
    setResult('');
    setError('');

    try {
      // Use the automatic chat ID detection system
      const chatIds = telegramBot.getAllChatIds();
      const chatIdEntries = Object.entries(chatIds);
      
      console.log('Stored chat IDs:', chatIds);
      
      if (chatIdEntries.length > 0) {
        const chatInfo = chatIdEntries.map(([chatId, info]) => ({
          chatId,
          username: info.username || 'No username',
          firstName: info.firstName || 'No first name',
          message: info.lastMessage || 'No text',
          timestamp: info.timestamp
        }));

        const firstChat = chatInfo[0];
        setFoundChatId(firstChat.chatId);
        setResult(`Found ${chatInfo.length} chat(s):\n\n${chatInfo.map(chat => 
          `Chat ID: ${chat.chatId}\nUsername: @${chat.username}\nName: ${chat.firstName}\nLast message: ${chat.message}\nTime: ${new Date(chat.timestamp).toLocaleString()}\n`
        ).join('\n')}\n\n✅ Chat ID ${firstChat.chatId} is ready for testing!`);
      } else {
        setResult('No chat IDs found. Please send a message to @on_me_bot first.\n\nThe system will automatically detect your chat ID within 30 seconds.');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const [foundChatId, setFoundChatId] = useState('');

  const sendTestMessage = async () => {
    setLoading(true);
    setResult('');
    setError('');

    try {
      const testMessage = `🧪 Test message from OnMyFeed bot\n\nTime: ${new Date().toLocaleString()}\n\nIf you receive this, your bot is working!`;
      
      // Use the found chat ID or prompt for one
      let chatId = foundChatId;
      if (!chatId) {
        chatId = prompt('Enter your chat ID (found from the previous step):');
      }
      
      if (!chatId) {
        setError('No chat ID provided. Please use "Find Chat ID" first.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${telegramBot.apiBase}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: testMessage,
          parse_mode: 'HTML'
        })
      });

      const data = await response.json();
      console.log('Send message response:', data);

      if (data.ok) {
        setResult('✅ Test message sent successfully! Check your Telegram.');
      } else {
        setError(`Failed to send message: ${data.description}`);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateChatIdInCode = async () => {
    if (!foundChatId) {
      setError('No chat ID found. Please use "Find Chat ID" first.');
      return;
    }

    try {
      // Create the updated code content
      const updatedCode = `const testChatId = '${foundChatId}'; // Updated automatically`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(updatedCode);
      
      setResult(prev => prev + `\n\n📋 Updated code copied to clipboard!\n\nPlease replace line 47 in src/utils/telegramBot.js with:\n${updatedCode}`);
    } catch (err) {
      setError(`Error copying to clipboard: ${err.message}`);
    }
  };

  return (
    <div className="chat-id-finder">
      <h2>🔍 Telegram Chat ID Finder</h2>
      <p>This tool helps you find your Telegram chat ID so the bot can send you verification codes.</p>
      
      <div className="steps">
        <h3>Steps:</h3>
        <ol>
          <li>Open Telegram and search for <strong>@on_me_bot</strong></li>
          <li>Start a chat with the bot (send any message like "hello")</li>
          <li>Click "Find Chat ID" below</li>
          <li>Copy your chat ID and use it in the verification</li>
        </ol>
      </div>

      <div className="actions">
        <button 
          onClick={findChatId} 
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Finding...' : '🔍 Find Chat ID'}
        </button>
        
        <button 
          onClick={async () => {
            setLoading(true);
            await telegramBot.detectNewChatIds();
            setTimeout(() => {
              findChatId();
              setLoading(false);
            }, 1000);
          }}
          disabled={loading}
          className="btn-refresh"
        >
          {loading ? 'Detecting...' : '🔄 Detect New'}
        </button>
        
        <button 
          onClick={sendTestMessage} 
          disabled={loading || !foundChatId}
          className="btn-secondary"
        >
          {loading ? 'Sending...' : '📤 Send Test Message'}
        </button>
        
        {foundChatId && (
          <>
            <button 
              onClick={() => {
                const code = `const testChatId = '${foundChatId}';`;
                navigator.clipboard.writeText(code);
                setResult(prev => prev + '\n\n📋 Chat ID copied to clipboard!');
              }}
              className="btn-copy"
            >
              📋 Copy Chat ID
            </button>
            <button 
              onClick={updateChatIdInCode}
              className="btn-update"
            >
              🔧 Update Code
            </button>
          </>
        )}
      </div>

      {result && (
        <div className="result">
          <h3>Result:</h3>
          <pre>{result}</pre>
        </div>
      )}

      {error && (
        <div className="error">
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}

      <div className="info">
        <h3>💡 How to use your Chat ID:</h3>
        <p>Once you find your chat ID, replace the <code>testChatId</code> in <code>src/utils/telegramBot.js</code> with your actual chat ID.</p>
        <p>Example: <code>const testChatId = '123456789';</code> → <code>const testChatId = 'YOUR_ACTUAL_CHAT_ID';</code></p>
      </div>
    </div>
  );
};

export default TelegramChatIdFinder; 