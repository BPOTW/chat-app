import { useEffect, useState } from "react"
import "./Signup.css"
import { checkIfLogedin, SignUp_handler } from "../../Utils/Handlers";
import { useNavigate } from "react-router";
import { IsLogedIn_G, UserName_G } from "../../Utils/Store";

export default function SignUp() {
    const navigate = useNavigate();
    const [username, setusername] = useState('');
    const [key, setkey] = useState('');
    const [rekey, setrekey] = useState('');
    const setUserName = UserName_G((state)=>state.setUserName);
    const {islogedin, setislogedin} = IsLogedIn_G((state) => state);

    function handleUsername(e) {
        setusername(e.target.value);
    }
    function handleKey(e) {
        setkey(e.target.value);
    }
    function handleRekey(e) {
        setrekey(e.target.value);
    }

    async function handleSignup() {
        if (username != '' && key != '' && rekey != '') {
            console.log('signup')
            const res = await SignUp_handler(username,key);
            if(res.login){
                navigate('/login')
            }
        }
    }

    useEffect(()=>{
    const data = checkIfLogedin(navigate);
        if(data){
            if (data.login) {
            setislogedin(true);
            setUserName(data.username);
            navigate("/chat");
        } else {
            setislogedin(false);
            setUserName('');
            navigate("/login");
        }
        }
  },[])

    return (
        <>
            <div className="signup-div">
                <div className="signup-title">SignUp</div>
                <div className="lables-inputs-div">
                    <div className="input-div username-div">
                        <label htmlFor="username" className="lable username-lable">UserName</label>
                        <input type="text" name="username" onChange={handleUsername} value={username} placeholder="Enter Username" className="input username-input" />
                    </div>
                    <div className="input-div key-div">
                        <label htmlFor="key" className="lable key-lable">Key</label>
                        <input type="text" name="key" onChange={handleKey} value={key} placeholder="Enter Key" className="input key-input" />
                    </div>
                    <div className="input-div repeat-key-div">
                        <label htmlFor="repeat-key" className="lable repeat-key-lable">Repeat Key</label>
                        <input type="text" name="repeat-key" onChange={handleRekey} value={rekey} placeholder="Re-Enter Same Key" className="input repeat-key-input" />
                    </div>
                    <div onClick={() => handleSignup()} className={`signup-btn ${username != '' && key != '' && rekey != '' ? 'signup-btn-active' : ''}`}>
                        <p>SignUp</p>
                    </div>
                    <div className="login-redirect-div">
                        <p>Don't have an account <a href="/login">Login</a></p>
                    </div>
                </div>
            </div>
        </>
    )
}