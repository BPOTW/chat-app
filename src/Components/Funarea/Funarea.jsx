import { useState } from "react";
import "./Funarea.css"
import showMore from "../../assets/plus.svg"
import showLess from "../../assets/minus.svg"
import CreateRoom from "../CreateRoom/CreateRoom";
import { ActionBtns_G } from "../../Utils/Store";

export default function FunArea() {
    const [collapseFunArea, setCollapseFunArea] = useState(false);
    const toggleCreateRoom = ActionBtns_G((state) => state.toggleCreateRoom);
    const createRoom = ActionBtns_G((state) => state.createRoom);
    function CollapseFunArea() {
        setCollapseFunArea(!collapseFunArea);
    }
    function showCreateRoom(){
        toggleCreateRoom(true);
    }
    return (
        <>
            {
                createRoom ?
                    <CreateRoom /> :
                    <div></div>
            }
            <div className='titles-div' onClick={CollapseFunArea}>
                <h2 className="funArea-title settings-titles" >Actions</h2>
                <img src={collapseFunArea ? showMore : showLess} width={16} alt="" />
            </div>
            <div className={`funArea-div ${collapseFunArea ? 'collapse-funarea' : 'show-funarea'}`}>
                <div className='funArea-btn textBox-div' onClick={()=>showCreateRoom()}>
                    Create Room
                </div>
                <div className='funArea-btn textBox-div'>
                    Discover Rooms
                </div>
                <div className='funArea-btn textBox-div'>
                    Random Chat Room
                </div>
                <div className='funArea-btn textBox-div'>
                    Chat With Stranger
                </div>
            </div>
        </>
    )
}