import "./Savedrooms.css"
import showMore from "../../assets/plus.svg"
import showLess from "../../assets/minus.svg"
import Delete from "../../assets/trash.svg"
import { useEffect, useState } from "react";
import { JoinedRoomId_G, Rooms_G, UserName_G } from "../../Utils/Store";
import { JoinRoom_S } from "../../Utils/SocketServices";

export default function SavedRooms() {
    const rooms = Rooms_G((state) => state.rooms);
    const delRoom = Rooms_G((state) => state.delRoom);
    const joinedRoomId = JoinedRoomId_G((state) => state.joinedRoomId);
    const [collapseSavedRooms, setCollapseSavedRooms] = useState(true);
    const userName = UserName_G((state) => state.userName);
    function CollapseSavedRooms() {
        setCollapseSavedRooms(!collapseSavedRooms);
    }

    useEffect(() => {
        console.log("rooms are", rooms);
    }, []);

    function deleteSavedRoom(id){
        delRoom(id);
    }

    function joinRoom(id){
        JoinRoom_S(id,userName);
    }

    return (
        <>
            <div className='titles-div' onClick={CollapseSavedRooms}>
                <h2 className="savedRooms-title settings-titles">Saved Rooms</h2>
                <img src={collapseSavedRooms ? showMore : showLess} width={16} alt="" />
            </div>
            <div className={`savedRooms-div ${collapseSavedRooms ? 'collapse-savedrooms' : 'show-savedrooms'}`}>

                {Object.entries(rooms).map(([roomName, roomArray]) =>
                    roomArray.map((room, index) => {
                        return (
                            <div key={index} className='savedRoom-div textBox-div' onClick={()=>joinRoom(roomName)}>
                                {roomName}
                            <img src={Delete} width={18} alt="Delete room" onClick={()=>deleteSavedRoom(roomName)}/>
                            </div>
                            );
                    }),
                )};

            </div>
        </>
    )
}