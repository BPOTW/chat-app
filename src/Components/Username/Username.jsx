import "./Username.css"
import Logout_icon from "../../assets/log-out-white.svg"
import { UserName_G, IsLogedIn_G } from "../../Utils/Store";
import { useNavigate } from "react-router";

export default function UserName() {
  const navigate = useNavigate();
  const userName = UserName_G((state) => state.userName);
  const setUserName = UserName_G((state) => state.setUserName);
  const setislogedin = IsLogedIn_G((state) => state.setislogedin);


  const LogOut_handler = () => {
    try {
      setUserName('');
      localStorage.removeItem("login_data");
      setislogedin(false);
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <div className="title-icon-div">
        <p className="userName-title settings-titles">User Name</p>
        <img src={Logout_icon} onClick={LogOut_handler} width={20} alt="logout" title="Logout" />
      </div>
      <div className='userName-div textBox-div'>
        {userName}
      </div>
    </>
  )
}