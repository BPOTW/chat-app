import './App.css'
import Search from "./assets/search.svg"
import Send from "./assets/send.svg"
import { useState, useRef, useEffect } from 'react';
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5050";
let socket;

function App() {

  const [messages, setMessages] = useState([]);
  const [myId, setmyId] = useState('');
  const [roomId, setroomId] = useState('');
  const [input, setInput] = useState('');
  const [searchInput, setsearchInput] = useState('');

  const messagesEndRef = useRef(null);


  const [receivedRequest, setreceivedRequest] = useState({ id: "", received: false });
  const [joined, setJoined] = useState(false);
  const [checkIdResult, setcheckIdResult] = useState({ id: "", isAvailable: false });
  const [isConnected, setisConnected] = useState(false);
  const [connectedChat, setconnectedChat] = useState("");
  const [participents, setparticipents] = useState([]);


  useEffect(() => {
    socket = io(SOCKET_URL);
    socket.on("connect", () => {
      console.log("Connected to server")
      setmyId(socket.id);
      setisConnected(true);
      handleRegister();
    });

    socket.on('checkIdResult', (data) => {
      // console.log(data);
      setcheckIdResult(data);
    })

    socket.on('checkRoomResult', (data) => {
      console.log(data);
      handleJoinChat(data.id);
    })

    socket.on('request', (id) => {
      // console.log(id);
      setreceivedRequest({ id: id, received: true });
    })

    socket.on("message", (msg) => {
      console.log(msg)
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("disconnect", () => {
      setisConnected(false);
      setmyId('Not Connected');
      console.log("Disconnected")
    });

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    return () => socket.disconnect();
  }, []);

  function handleSearchInput(e) {
    setsearchInput(e.target.value)
    console.log(e.target.value);
  }

  function handleSearchId(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      console.log('enter pressed')
      e.preventDefault();
      searchForId();
    }
  }

  const searchForId = () => {
    socket.emit("checkId", searchInput);
  };

  const handleRegister = () => {
    socket.emit("register", myId);
  };

  const handleSendRequest = () => {
    socket.emit("sendRequest", { senderId: myId, receiverId: checkIdResult.id });
    handleJoinChat(myId)
  };

  function cancelRequest() {
    setreceivedRequest({id:'',received:false});
  }

  async function acceptRequest(){
    socket.emit("checkRoom", { roomId:receivedRequest.id, senderId:myId});
  }

  function handleJoinChat(id){
      socket.emit("join", { chatId: id, userId: myId });
      setJoined(true);
      setconnectedChat(id);
      setreceivedRequest({id:'',received:false});
  }

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    // setMessages((prev) => [...prev, {text:text, id:myId}]);
    socket.emit("send", { chatId: connectedChat, msg:text, id: myId });
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
        {
          isConnected ?
            <div className='connected'>Connected</div> :
            <div className='disconnected'>Disconnected</div>
        }

        {
          receivedRequest.received ? 
          <div className='request-div'>
          <div className='request-msg-div'>gGaglmUXuhxSsbVuAAAH Wants to chat with you.</div>
          <div className='request-btns-div'>
            <div className='request-cancel' onClick={cancelRequest}>Cancel</div>
            <div className='request-accept' onClick={acceptRequest}>Accept</div>
          </div>
        </div>
        :
        <div></div>
        }
        <div className='chat-settings-div'>

          <div className='settings-div'>

            <p className="title">My ID</p>
            <div className='myId-div textBox-div'>
              {myId}
            </div>

            <div className='spacer'></div>

            {
              !joined ?
                <div className='search-div'>
                  <h2 className="search-title">Search</h2>

                  <div className="search-bar" role="search">
                    <div className="search-icon"><img src={Search} alt="" /></div>
                    <input
                      className="search-input"
                      type="search"
                      placeholder="Search friends..."
                      onChange={handleSearchInput}
                      onKeyDown={handleSearchId}
                    />
                  </div>
                  {
                    checkIdResult.isAvailable ?
                      <div className='searchResult textBox-div'>
                        {checkIdResult.id}
                        <img src={Send} width={20} className='sendRequest-icon' onClick={handleSendRequest} alt="" />
                      </div>
                      :
                      <div></div>
                  }
                </div>
                :
                <div className='main-participents-div'>
                  <h2 className="search-title">Joined Room ID</h2>
                  <div className='joinedRoomId-div textBox-div'>
                    {connectedChat}
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
                </div>}

            {/* <div className='spacer'></div> */}

          </div>

          <div className='chat-div'>
            <div className='messages' role='log' aria-live='polite'>
              {messages.map((m,index) => (
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
          Made with passion by<p> Zain Ali</p>
        </div>
      </div>
    </>
  )
}

export default App
