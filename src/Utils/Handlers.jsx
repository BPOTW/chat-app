import axios from "axios";


const Login_handler = async (username, password) => {
  try {
    const res = await axios.post("http://localhost:5050/login", {
      username: username,
      password: password
    });

    return res.data;
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    return null;
  }
};

const SignUp_handler = async (username, password) => {
  try {
    const res = await axios.post("http://localhost:5050/signup", {
      username: username,
      password: password,
      sessionid:''
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const SaveSessionid_handler = async (sessionid) => {
  try {
    const res = await axios.post("http://localhost:5050/id", {
      sessionid:sessionid
    });

    console.log(res.data); // the server response
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
};


const checkIfLogedin = (navigate)=>{
  try{
    const login_data = localStorage.getItem("login_data");
    return login_data ? JSON.parse(login_data) : null;
  }catch(error){
    console.log(error);
    return null;
  }
}

export {
    Login_handler,
    SignUp_handler,
    SaveSessionid_handler,
    checkIfLogedin,
}