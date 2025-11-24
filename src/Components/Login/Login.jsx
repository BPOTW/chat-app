import { useEffect, useState } from "react"
import "./Login.css"
import { checkIfLogedin, Login_handler } from "../../Utils/Handlers";
import { UserName_G, IsLogedIn_G } from "../../Utils/Store";
import { useNavigate } from "react-router";

export default function Login() {
    const navigate = useNavigate();
    const [username, setusername] = useState('');
    const [key, setkey] = useState('');
    const setUserName = UserName_G((state) => state.setUserName);
    const setislogedin = IsLogedIn_G((state) => state.setislogedin);

    function handleUsername(e) {
        setusername(e.target.value);
    }
    function handleKey(e) {
        setkey(e.target.value);
    }

    async function handleLogin() {
        if (username != '' && key != '') {
            console.log('login')
            const res = await Login_handler(username, key);
            if (res.login) {
                setUserName(res.userData.username);
                localStorage.setItem("login_data", JSON.stringify({
                    'login': true,
                    'username': res.userData.username,
                }));
                setislogedin(true);
                navigate('/chat');
            }
        }
    }


    useEffect(() => {
        const data = checkIfLogedin(navigate);
        if (data) {
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
    }, [])

    return (
        <>
            <div className="login-div">
                <div className="login-title">Login</div>
                <div className="lables-inputs-div">
                    <div className="input-div username-div">
                        <label htmlFor="username" className="lable username-lable">UserName</label>
                        <input type="text" name="username" onChange={handleUsername} value={username} placeholder="Enter Username" className="input username-input" />
                    </div>
                    <div className="input-div key-div">
                        <label htmlFor="key" className="lable key-lable">Key</label>
                        <input type="text" name="key" onChange={handleKey} value={key} placeholder="Enter Key" className="input key-input" />
                    </div>

                    <div onClick={() => handleLogin()} className={`login-btn ${username != '' && key != '' ? 'login-btn-active' : ''}`}>
                        <p>Login</p>
                    </div>
                    <div className="signup-redirect-div">
                        <p>Don't have an account <a href="/signup">Signup</a></p>
                    </div>
                </div>
            </div>
        </>
    )
}