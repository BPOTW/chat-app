import { useState } from "react"
import "./Profile.css"
import showMore from "../../assets/plus.svg"
import showLess from "../../assets/minus.svg"
import { ProfileBtns_G, UserName_G } from "../../Utils/Store"
import { updateUser } from "../../Utils/SocketServices"

export default function Profile() {

  const {Private, Invite, SaveChat, togglePrivate, toggleInvite, toggleSave} = ProfileBtns_G();
  const userName = UserName_G((state) => state.userName);

  const [collapse, setCollapse] = useState(true);

  function handlePrivate(){
    togglePrivate();
    const private_ = ProfileBtns_G.getState().Private;
    updateUser(userName,{private:private_,invite:Invite,savechat:SaveChat});
  }
  function handleInvite(){
    toggleInvite();
    const invite_ = ProfileBtns_G.getState().Invite;
    updateUser(userName,{private:Private,invite:invite_,savechat:SaveChat});
  }
  function handleSaveChat(){
    toggleSave();
    const save_ = ProfileBtns_G.getState().SaveChat;
    updateUser(userName,{private:Private,invite:Invite,savechat:save_});
  }

  function Collapse() {
    setCollapse(!collapse);
  }
    return(
        <>
            <div onClick={Collapse} className='titles-div'>
              <p className="profile-title settings-titles" onClick={Collapse}>Profile</p>
              <img src={collapse ? showMore : showLess} width={16} alt="" />
            </div>

            <div className={`profileSection-div ${collapse ? 'collapse-profile' : 'show-profile'}`}>
              <div className='private-div'>
                <p>Set as Private</p>
                <input type="checkbox" checked={Private} onChange={()=>{handlePrivate()}} className='private-radio' />
              </div>
              <div className='invite-div'>
                <p>Block Requests</p>
                <input type="checkbox" checked={Invite} onChange={()=>handleInvite()} className='invite-radio' />
              </div>
              <div className='saveChat-div'>
                <p>Save Chats</p>
                <input type="checkbox" checked={SaveChat} onChange={()=>handleSaveChat()} className='saveChat-radio' />
              </div>
            </div>
        </>
    )
}