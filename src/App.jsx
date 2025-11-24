import './App.css'
import { useEffect } from 'react';
import { checkIfLogedin } from './Utils/Handlers';
import { useNavigate } from "react-router";
import { IsLogedIn_G, UserName_G } from './Utils/Store';

function App() {
  const navigate = useNavigate();
  const { islogedin, setislogedin } = IsLogedIn_G((state) => state);
  const setUserName = UserName_G((state) => state.setUserName);

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
    }else {
            setislogedin(false);
            setUserName('');
            navigate("/login");
        }
  }, [])

  return;
}

export default App

//add a feature of anonymity. no one will know who send the message in the chat room