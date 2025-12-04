import "./App.css"
import { useState, useRef, useEffect } from 'react';
import UserName from './Components/Username/Username';
import Profile from './Components/Profile/Profile';
import Search from "./Components/Search/Search"
import { SocketManager } from './Utils/SocketListner';
import { ServerConnected_G, Received_Request_Data_G, IsLogedIn_G, UserName_G, Messages_G, JoinedRoomId_G, Rooms_G } from './Utils/Store';
import { useNavigate } from "react-router";
import { checkIfLogedin } from "./Utils/Handlers";
import FunArea from "./Components/Funarea/Funarea";
import SavedRooms from "./Components/Savedrooms/Savedrooms";
import ChatInfo from "./Components/ChatInfo/ChatInfo";
import Participents from "./Components/Participents/Participents";
import { AcceptRequest_S, leaveRoom_S, sendMessage_S } from "./Utils/SocketServices";
import ChatSettings from "./Components/ChatSettings/ChatSettings";

export default function Home() {
    const navigate = useNavigate();

    const isConnected = ServerConnected_G((state) => state.isConnected);
    const isConnecting = ServerConnected_G((state) => state.isConnecting);
    const { islogedin, setislogedin } = IsLogedIn_G((state) => state);
    const { requestId_G, roomId_G, setRequestId } = Received_Request_Data_G((state) => state);
    const { messages, addMessage, setMessages, clearMessages } = Messages_G((state) => state);
    const setUserName = UserName_G((state) => state.setUserName);
    const userName = UserName_G((state) => state.userName);
    const { joinedRoomId, setjoinedRoomId } = JoinedRoomId_G((state) => state);
    const rooms = Rooms_G((state) => state.rooms);
    const [input, setInput] = useState('');

    const messagesEndRef = useRef(null);


    useEffect(() => {
        const data = checkIfLogedin(navigate);
        if (data) {
            if (data.login) {
                setislogedin(true);
                setUserName(data.username);
            } else {
                setislogedin(false);
                setUserName('');
                navigate("/login");
            }
        } else {
            setislogedin(false);
            setUserName('');
            navigate("/login");
        }

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    function cancelRequest() {
        setRequestId('', '');
    }

    async function acceptRequest() {
        AcceptRequest_S(roomId_G, userName);
        if (joinedRoomId != '') {
            const allowSaveChat = rooms[joinedRoomId].roomData.allowSaveChat;
            if (!allowSaveChat) {
                clearMessages(joinedRoomId);
            }
        }
        setRequestId('', '');
    }

    const sendMessage = () => {
        const text = input.trim();
        if (joinedRoomId != '') {
            if (!text) return;
            const msgData = {
                id: Date.now(),
                text: text,
                senderId: userName,
                timestamp: Date.now(),
            }
            sendMessage_S({ roomId: joinedRoomId, msg: text, sender: userName, timestamp: Date.now() });
        }
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    function handleClearRoom() {
        clearMessages(joinedRoomId);
    }

    function handleLeaveRoom() {
        leaveRoom_S(joinedRoomId);
        if (joinedRoomId != '') {
            const allowSaveChat = rooms[joinedRoomId].roomData.allowSaveChat;
            if (!allowSaveChat) {
                clearMessages(joinedRoomId);
            }
        }
        setjoinedRoomId('');
    }


    return (
        <>

            {
                islogedin ? <>
                    <SocketManager />
                    {
                        isConnecting ?
                            <div className='connecting'>Connecting...</div> :
                            (isConnected ?
                                <div className='connected'>Connected</div> :
                                <div className='disconnected'>Disconnected</div>)
                    }

                    {
                        requestId_G != '' ?
                            <div className='request-div'>
                                <div className='request-msg-div'>{requestId_G} wants you to join {roomId_G}.</div>
                                <div className='request-btns-div'>
                                    <div className='request-cancel' onClick={cancelRequest}>Cancel</div>
                                    <div className='request-accept' onClick={acceptRequest}>Accept</div>
                                </div>
                            </div>
                            :
                            <div></div>
                    }
                    <div className='main-div'>

                        <div className='settings-div'>

                            <UserName username={"testusername"} />

                            <div className='spacer'></div>

                            <div className='scroll-area'>

                                <Profile />

                                <div className='spacer'></div>

                                <FunArea />

                                <div className='spacer'></div>

                                <SavedRooms />

                                <div className='spacer'></div>
                            </div>

                        </div>

                        <div className='chat-div'>
                            <div className='chat-info-div'>
                                {
                                    joinedRoomId != '' ?
                                        <div className='chatInfo-div'>
                                            <ChatInfo />
                                            <div className='spacer'></div>
                                            <div className='scroll-area-chat-info'>
                                                {rooms[joinedRoomId].roomData.adminId == userName ?
                                                    <>
                                                        <ChatSettings />
                                                        <div className='spacer'></div>
                                                    </>
                                                    : <div></div>}
                                                {rooms[joinedRoomId].roomData.allowAddPeople ? <>
                                                    <Search />
                                                    <div className='spacer'></div>
                                                </> : <></>}
                                                <Participents />
                                                <div className='spacer'></div>
                                            </div>
                                            <div className="btns-div">
                                                <div className="clear_room_btn" onClick={handleClearRoom}>Clear</div>
                                                <div className="leave_room_btn" onClick={handleLeaveRoom}>Leave</div>
                                            </div>
                                        </div>
                                        : <div></div>
                                }
                                <div className='messages'>
                                    {[...(messages[joinedRoomId] || [])].map((m, index) => {
                                        const time = new Date(m.timestamp).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true
                                        });
                                        return (
                                            <div
                                                key={index}
                                                className={`message ${m.senderId == userName ? 'message-sent' : 'message-received'}`}>
                                                <div className='message-info-div'>
                                                    {rooms[joinedRoomId].roomData.showSenderId ? <>{m.senderId} : </> : ''}{time}
                                                </div>
                                                <div>
                                                    {m.text}
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>

                            <div className='input-area '>
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
                </> : <div></div>
            }
        </>
    )
}

