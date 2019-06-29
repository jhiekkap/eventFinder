import React, { useState } from "react";
import userService from "./../../services/users"

const SignUp = props => {
  const {
    
    loggedUser,
    setIsLogged,
    setLoggedUser, 
    setShowModal, 
    showSignUp,
    setShowSignUp,
    favoriteEvents
  } = props;

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = e => {
    e.preventDefault()
    let newUser = {
      name: name,
      username: username,
      password: password,
      favorites: favoriteEvents 
    }
    userService.create(newUser)
    setLoggedUser(newUser)
    setIsLogged(true)
    //alert('New user created')
    setShowSignUp(false);
    setShowModal(false); 
  };

    return showSignUp && 
      <div>
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div>
            Name
            <input
              type="text"
              value={name}
              name="name"
              onChange={({ target }) => setName(target.value)}
            />
          </div>
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
          <button type="submit">Submit</button>
          <button
            onClick={() => {
              setShowSignUp(false);
              setShowModal(false);
            }}
          >
            Cancel
          </button>
        </form>
      </div> 
};

export default SignUp;
