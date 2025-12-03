import { useState } from "react";
import { JoinedRoomId_G, Participants_G } from "../../Utils/Store";
import "./Participents.css";
import showLess from "../../assets/minus.svg";
import showMore from "../../assets/plus.svg";

export default function Participents() {
    const participants = Participants_G((state) => state.participants);
    const { joinedRoomId, setjoinedRoomId } = JoinedRoomId_G((state) => state);
    const [collapseParticipants, setCollapseParticipants] = useState(false);
    function CollapseParticipants() {
        setCollapseParticipants(!collapseParticipants);
    }
    return (
        <>
            <div className='titles-div' onClick={CollapseParticipants}>
                <h2 className="participents-title settings-titles">Members - ({(participants[joinedRoomId] || []).length})</h2>
                <img src={collapseParticipants ? showMore : showLess} width={16} alt="" />
            </div>
            <div className={`participents-div ${collapseParticipants ? 'collapse-participants' : 'show-participants'}`}>
                {
                    (participants[joinedRoomId] || []).map((p, index) => {
                        return (
                        <div key={index} className='participent-div textBox-div'>
                            <p>{p}</p>
                        </div>)
                    })}
            </div>
        </>
    )
}