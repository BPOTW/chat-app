import './App.css'
import Search from "./assets/search.svg"
import { useState, useRef, useEffect } from 'react';

function App() {

  const [messages, setMessages] = useState([
    { id: 1, text: 'Welcome to the chat', sender: 'sender-id' },
    { id: 1, text: 'Welcome to the chat', sender: 'me' },
    { id: 1, text: 'Welcome to the chat', sender: 'sender-id' },
    { id: 1, text: 'Welcome to the chat', sender: 'sender-id' },
    { id: 1, text: 'Welcome to the chat', sender: 'me' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now(), text, sender: 'me' }]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <div className='main-div'>
        <div className='chat-settings-div'>

          <div className='settings-div'>

            <h2 className="settings-title">Settings</h2>

            <div className="search-bar" role="search">
              <div className="search-icon"><img src={Search} alt="" /></div>
              <input
                className="search-input"
                type="search"
                placeholder="Search friends..."
              />
            </div>

            <p className="title">My ID</p>
            <div className='myId-div textBox-div'>
              AHS23YFH57DG
            </div>

            <div className='spacer'></div>

            <div className='participent-title-count-div'>
              <p className="participents-title">Participents</p>
              <p className='participents-count'>( 9 )</p>
            </div>
            <div className='participents-div'>
              <div className='participent textBox-div'>
                AHS23YFH57DG
              </div>
            </div>



          </div>

          <div className='chat-div'>
            <div className='messages' role='log' aria-live='polite'>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`message ${m.sender === 'me' ? 'message-sent' : 'message-received'}`}>
                  <div className='message-info-div'>
                    {m.id} : 10:40pm
                  </div>
                  <div>
                  {m.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className='input-area'>
              <input
                className='message-input'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Type a message...'
              />
              <button className='send-button' onClick={sendMessage} aria-label='Send message'>
                Send
              </button>
            </div>
          </div>
        </div>
        <div className='footer-div'>
          Made with love by<p> Zain Ali</p>
        </div>
      </div>
    </>
  )
}

export default App
