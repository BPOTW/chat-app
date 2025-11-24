import { useState } from "react"
import "./Profile.css"
import showMore from "../../assets/plus.svg"
import showLess from "../../assets/minus.svg"
import { ProfileBtns_G } from "../../Utils/Store"

export default function Profile() {

  const {Private, Invite, SaveChat, togglePrivate, toggleInvite, toggleSave} = ProfileBtns_G();

  const [collapse, setCollapse] = useState(true);

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
                <input type="radio" checked={Private} onChange={()=>togglePrivate()} className='private-radio' />
              </div>
              <div className='invite-div'>
                <p>Accept Invites</p>
                <input type="radio" checked={Invite} onChange={()=>toggleInvite()} className='invite-radio' />
              </div>
              <div className='saveChat-div'>
                <p>Save Chats</p>
                <input type="radio" checked={SaveChat} onChange={()=>toggleSave()} className='saveChat-radio' />
              </div>
            </div>
        </>
    )
}