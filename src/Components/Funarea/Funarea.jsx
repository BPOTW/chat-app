import { useState } from "react";
import "./Funarea.css"
import showMore from "../../assets/plus.svg"
import showLess from "../../assets/minus.svg"
import CreateRoom from "../CreateRoom/CreateRoom";
import { ActionBtns_G, JoinedRoomId_G, Messages_G, Rooms_G, UserName_G } from "../../Utils/Store";
import DiscoverRooms from "../DiscoverRooms/DiscoverRooms";
import { JoinRandomRoom_S } from "../../Utils/SocketServices";

export default function FunArea() {
    const [collapseFunArea, setCollapseFunArea] = useState(false);
    const toggleCreateRoom = ActionBtns_G((state) => state.toggleCreateRoom);
    const toggleDiscoverRooms = ActionBtns_G((state) => state.toggleDiscoverRooms);
    const createRoom = ActionBtns_G((state) => state.createRoom);
    const discoverRooms = ActionBtns_G((state) => state.discoverRooms);
    const userName = UserName_G((state) => state.userName);
    const joinedRoomId = JoinedRoomId_G((state) => state.joinedRoomId);
    const rooms = Rooms_G((state) => state.rooms);
    const { messages, addMessage, setMessages, clearMessages } = Messages_G((state) => state);

    function CollapseFunArea() {
        setCollapseFunArea(!collapseFunArea);
    }
    function showCreateRoom() {
        toggleCreateRoom(true);
    }
    function showDiscoverRoom() {
        toggleDiscoverRooms(true);
    }
    function JoinRandomRoom() {
        if (joinedRoomId != '') {
            const allowSaveChat = rooms[joinedRoomId].allowSaveChat;
            if (!allowSaveChat) {
                clearMessages(joinedRoomId);
            }
        }
        JoinRandomRoom_S(userName);
    }
    return (
        <>
            {
                createRoom ?
                    <CreateRoom /> :
                    <div></div>
            }
            {
                discoverRooms ?
                    <DiscoverRooms /> :
                    <div></div>
            }
            <div className='titles-div' onClick={CollapseFunArea}>
                <h2 className="funArea-title settings-titles" >Actions</h2>
                <img src={collapseFunArea ? showMore : showLess} width={16} alt="" />
            </div>
            <div className={`funArea-div ${collapseFunArea ? 'collapse-funarea' : 'show-funarea'}`}>
                <div className='funArea-btn textBox-div' onClick={() => showCreateRoom()}>
                    Create Room
                </div>
                <div className='funArea-btn textBox-div' onClick={() => showDiscoverRoom()}>
                    Discover Rooms
                </div>
                <div className='funArea-btn textBox-div' onClick={() => JoinRandomRoom()}>
                    Random Chat Room
                </div>
                {/* <div className='funArea-btn textBox-div'>
                    Chat With Stranger
                </div> */}
            </div>
        </>
    )
}