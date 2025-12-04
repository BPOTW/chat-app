import { useEffect, useState } from "react";
import { ActionBtns_G, DiscoverRoomsList_G, JoinedRoomId_G, Messages_G, Rooms_G, UserName_G } from "../../Utils/Store";
import "./DiscoverRoom.css"
import { JoinRoom_S, triggerGetRooms_S } from "../../Utils/SocketServices";

export default function DiscoverRoom() {
    const toggleDiscoverRooms = ActionBtns_G(state => state.toggleDiscoverRooms);
    const listOfRooms = DiscoverRoomsList_G(state => state.listOfRooms);
    const joinedRoomId = JoinedRoomId_G(state => state.joinedRoomId);
    const userName = UserName_G(state => state.userName);
    const rooms = Rooms_G((state) => state.rooms);
    const { messages, addMessage, setMessages, clearMessages } = Messages_G((state) => state);
    
    function handleCloseModal() {
        toggleDiscoverRooms(false);
    }

    function handleJoinRoom(id) {
        if (id != joinedRoomId) {
            if (joinedRoomId != '') {
                const allowSaveChat = rooms[joinedRoomId].allowSaveChat;
                if (!allowSaveChat) {
                    clearMessages(joinedRoomId);
                }
            }
            JoinRoom_S(id, userName);
            handleCloseModal();
        }
    }

    useEffect(() => {
        triggerGetRooms_S();
    }, []);

    const publicRoomCount = Array.isArray(listOfRooms)
        ? listOfRooms.filter(room => room.isPrivate === false).length
        : 0;

    return (
        <div className="modal-container">
            <div className="DiscoverRoom-div">
                <div className="DiscoverRoom-title">
                    Public Rooms - ({publicRoomCount})
                </div>

                <div className="discover-rooms-div">
                    {Array.isArray(listOfRooms) && publicRoomCount > 0 ? (
                        listOfRooms.map((data, index) =>
                            !data.isPrivate ? (
                                <div key={index} className="discover-room-div">
                                    <label className="lable username-lable">{data.roomId}</label>
                                    <label className="lable username-lable">
                                        Members - {data.participants.length}
                                    </label>
                                    <div className="joinRoom-btn" onClick={() => handleJoinRoom(data.roomId)}>
                                        Join Room
                                    </div>
                                </div>
                            ) : null
                        )
                    ) : (
                        <p className="no-room-avilable-lable">No rooms available</p>
                    )}
                </div>

                <div className="btns-div">
                    <div onClick={handleCloseModal} className="cancel-btn">
                        <p>Close</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
