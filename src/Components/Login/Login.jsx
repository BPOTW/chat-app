import { useEffect, useState } from "react"
import "./Login.css"
import { checkIfLogedin, Login_handler } from "../../Utils/Handlers";
import { UserName_G, IsLogedIn_G } from "../../Utils/Store";
import { useNavigate } from "react-router";

export default function Login() {
    const navigate = useNavigate();
    const [username, setusername] = useState('');
    const [key, setkey] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ show: false, message: '' });
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
            try {
                setLoading(true);
                const res = await Login_handler(username, key);
                if (res && res.login) {
                    setUserName(res.userData.username);
                    localStorage.setItem("login_data", JSON.stringify({
                        'login': true,
                        'username': res.userData.username,
                    }));
                    setislogedin(true);
                    navigate('/chat');
                } else {
                    const msg = (res && res.message) || 'Login failed. Please check credentials.';
                    setSnackbar({ show: true, message: msg });
                    setTimeout(() => setSnackbar({ show: false, message: '' }), 4000);
                }
            } catch (err) {
                setSnackbar({ show: true, message: 'Login failed. Try again.' });
                setTimeout(() => setSnackbar({ show: false, message: '' }), 4000);
            } finally {
                setLoading(false);
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
                        <input type="text" name="username" onChange={handleUsername} value={username} placeholder="Enter Username" className="input username-input" disabled={loading} />
                    </div>
                    <div className="input-div key-div">
                        <label htmlFor="key" className="lable key-lable">Key</label>
                        <input type="text" name="key" onChange={handleKey} value={key} placeholder="Enter Key" className="input key-input" disabled={loading} />
                    </div>

                    <div onClick={() => !loading && handleLogin()} className={`login-btn ${username != '' && key != '' ? 'login-btn-active' : ''} ${loading ? 'loading' : ''}`} aria-busy={loading}>
                        {loading ? (
                            <div className="spinner" aria-hidden="true"></div>
                        ) : (
                            <p>Login</p>
                        )}
                    </div>
                    <div className="signup-redirect-div">
                        <p>Don't have an account <a href="/signup">Signup</a></p>
                    </div>
                </div>
            </div>
            <div className={`snackbar ${snackbar.show ? 'show' : ''}`} role="status">
                {snackbar.message}
            </div>
        </>
    )
}