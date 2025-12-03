import { useState } from "react"
import "./ChatSettings.css"
import showMore from "../../assets/plus.svg"
import showLess from "../../assets/minus.svg"
import { JoinedRoomId_G, Rooms_G } from "../../Utils/Store"
import { updateRoomData_S, updateUser } from "../../Utils/SocketServices"
import { useEffect } from "react"

export default function ChatSettings() {

    const rooms = Rooms_G((state) => state.rooms);
    const updateRoom = Rooms_G((state) => state.updateRoom);
    const joinedRoomId = JoinedRoomId_G((state) => state.joinedRoomId);

    const [collapse, setCollapse] = useState(false);
    const [private_, setPrivate] = useState(false);
    const [showSenderId_, setSenderId] = useState(false);
    const [saveChat_, setSaveChat] = useState(false);
    const [allowAddPeople_, setallowAddPeople] = useState(false);

    let roomData_T = new Object();

    function handlePrivate() {
        setPrivate(!private_);
        roomData_T = rooms[joinedRoomId];
        roomData_T.roomData.isPrivate = !private_;
        updateRoom(joinedRoomId, roomData_T);
        updateRoomData_S(joinedRoomId, roomData_T.roomData);
    }
    function handleShowSenderId() {
        setSenderId(!showSenderId_);
        roomData_T = rooms[joinedRoomId];
        roomData_T.roomData.showSenderId = !showSenderId_;
        updateRoom(joinedRoomId, roomData_T);
        updateRoomData_S(joinedRoomId, roomData_T.roomData);
    }
    function handleSaveChat() {
        setSaveChat(!saveChat_);
        roomData_T = rooms[joinedRoomId];
        roomData_T.roomData.allowSaveChat = !saveChat_;
        updateRoom(joinedRoomId, roomData_T);
        updateRoomData_S(joinedRoomId, roomData_T.roomData);
    }
    function handleAllowAddPeople() {
        setallowAddPeople(!allowAddPeople_);
        roomData_T = rooms[joinedRoomId];
        roomData_T.roomData.allowAddPeople = !allowAddPeople_;
        updateRoom(joinedRoomId, roomData_T);
        updateRoomData_S(joinedRoomId, roomData_T.roomData);
    }

    function Collapse() {
        setCollapse(!collapse);
    }

    useEffect(() => {
        const roomData = rooms[joinedRoomId].roomData;
        setPrivate(roomData.isPrivate);
        setallowAddPeople(roomData.allowAddPeople);
        setSaveChat(roomData.allowSaveChat);
        setSenderId(roomData.showSenderId);
    }, [joinedRoomId])

    return (
        <>
            <div onClick={Collapse} className='titles-div'>
                <p className="chatSettings-title settings-titles" onClick={Collapse}>Settings</p>
                <img src={collapse ? showMore : showLess} width={16} alt="" />
            </div>

            <div className={`chatSettingsSection-div ${collapse ? 'collapse-chatSettings' : 'show-chatSettings'}`}>
                <div className='private-div'>
                    <p>Set as Private</p>
                    <input type="checkbox" checked={private_} onChange={() => { handlePrivate() }} className='private-radio' />
                </div>
                <div className='showSender-div'>
                    <p>Show Sender ID</p>
                    <input type="checkbox" checked={showSenderId_} onChange={() => handleShowSenderId()} className='showSender-radio' />
                </div>
                <div className='saveChat-div'>
                    <p>Allow Save Chats</p>
                    <input type="checkbox" checked={saveChat_} onChange={() => handleSaveChat()} className='saveChat-radio' />
                </div>
                <div className='allowAdd-div'>
                    <p>Allow Add People</p>
                    <input type="checkbox" checked={allowAddPeople_} onChange={() => handleAllowAddPeople()} className='allowAdd-radio' />
                </div>
            </div>
        </>
    )
}
