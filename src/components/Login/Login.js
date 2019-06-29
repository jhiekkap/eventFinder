import React, { useState } from "react";
import loginService from "./../../services/login" 

const Login = props => {
  const { 

    setIsLogged, 
    setLoggedUser, 
    setShowModal,
    showLogin,
    setShowLogin,
    setFavoriteEvents

  } = props;
 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

   

  const handleLogin = async event => {
    event.preventDefault();
    try {
      console.log('TRYING TO LOG IN')
      const user = await loginService.login({ username, password });
      console.log('USER: ',user)
      
      window
        .localStorage
        .setItem('loggedBlogappUser', JSON.stringify(user))
      loginService.setToken(user.token)

      setLoggedUser(user); 
      setFavoriteEvents(user.favorites)
      setUsername("");
      setPassword("");
      setShowLogin(false);
      setShowModal(false);
      setIsLogged(true); 
      //alert('login successfull')

    } catch (exception) {
      alert('wrong username or password')
    }
  };
 
  
    return showLogin &&
      <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          
          <div>
            Username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            Password
            <input
              type="password"
              value={password} 
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit"
            >Submit</button>
          <button
            onClick={() => {
              setShowLogin(false);
              setShowModal(false);
            }}
          >
            Cancel 
          </button>
        </form>
      </div> 
};

export default Login;
