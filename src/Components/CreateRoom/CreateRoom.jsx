import { useState } from "react"
import "./CreateRoom.css"
import { useNavigate } from "react-router";
import { ActionBtns_G, UserName_G } from "../../Utils/Store";
import { CreateRoom_S } from "../../Utils/SocketServices";

export default function CreateRoom() {
    const navigate = useNavigate();
    const [roomname, setroomname] = useState('');
    const [private_, setprivate_] = useState(true);
    const [sender, setsender] = useState(false);
    const [savechat, setsavechat] = useState(false);
    const [allowadd, setallowadd] = useState(false);
    const userName = UserName_G((state) => state.userName);
    const toggleCreateRoom = ActionBtns_G((state) => state.toggleCreateRoom);

    function handleRoomName(e) {
        setroomname(e.target.value);
    }
    function handlePrivate_chk() {
        setprivate_(!private_);
    }
    function handleSenderId_chk() {
        setsender(!sender);
    }
    function handleSaveChat_chk() {
        setsavechat(!savechat);
    }
    function handleAllowAdd_chk() {
        setallowadd(!allowadd);
    }

    async function handleCreateRoom() {
        if (roomname != '') {
            console.log('createroom');
            CreateRoom_S(roomname, {
                adminId: userName,
                isPrivate: private_,
                showSenderId: sender,
                allowSaveChat: savechat,
                allowAddPeople: allowadd,
            });
            toggleCreateRoom(false);
        }
    }

    async function handleCloseModal() {
        console.log('close room')
        toggleCreateRoom(false);
    }

    return (
        <div className="modal-container" >
            <div className="createroom-div">
                <div className="createroom-title">Create New Room</div>
                <div className="lables-inputs-div">
                    <div className="input-div username-div">
                        <label htmlFor="roomname" className="lable username-lable">Room Name</label>
                        <input type="text" name="roomname" onChange={handleRoomName} value={roomname} placeholder="Enter Room Name" className="input username-input" />
                    </div>
                    <div className="setting-div key-div">
                        <label htmlFor="setasprivate" className="setting-lable">Set as private</label>
                        <input type="checkbox" name="setasprivate" onChange={handlePrivate_chk} checked={private_} className="checkbox" />
                    </div>
                    {
                        private_ ?
                            <div className="private-room-warning-div" >
                                <p>No one will be able to find or join private rooms unless you send them join request</p>
                            </div> :
                            <div></div>
                    }
                    <div className="setting-div repeat-key-div">
                        <label htmlFor="showsenderid" className="setting-lable">Show sender ID</label>
                        <input type="checkbox" name="showsenderid" onChange={handleSenderId_chk} checked={sender} className="checkbox" />
                    </div>
                    <div className="setting-div repeat-key-div">
                        <label htmlFor="allowsavechat" className="setting-lable">Allow save chat</label>
                        <input type="checkbox" name="allowsavechat" onChange={handleSaveChat_chk} checked={savechat} className="checkbox" />
                    </div>
                    <div className="setting-div repeat-key-div">
                        <label htmlFor="allowaddpeople" className="setting-lable">Allow others to add people</label>
                        <input type="checkbox" name="allowaddpeople" onChange={handleAllowAdd_chk} checked={allowadd} className="checkbox" />
                    </div>

                    <div className="btns-div">
                        <div onClick={() => handleCloseModal()} className={`cancel-btn`} >
                            <p>Cancel</p>
                        </div>
                        <div onClick={() => handleCreateRoom()} className={`createroom-btn ${roomname != '' ? 'createroom-btn-active' : ''}`}>
                            <p>Create Room</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}