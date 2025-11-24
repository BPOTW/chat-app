import "./Messages.css";

export default function Messages() {
    return(
        <div className='messages'>
              {messages.map((m, index) => (
                <div
                  key={index}
                  className={`message ${m.id == myId ? 'message-sent' : 'message-received'}`}>
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
    )
}