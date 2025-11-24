import { JoinedRoomId_G } from "../../Utils/Store";
import "./ChatInfo.css"

export default function ChatInfo() {
  const { joinedRoomId, setjoinedRoomId } = JoinedRoomId_G((state) => state);
  return (
    <>
      <p className="room-title settings-titles">Room</p>
      <div className='room-div textBox-div'>
        {joinedRoomId}
      </div>
    </>
  )
} 