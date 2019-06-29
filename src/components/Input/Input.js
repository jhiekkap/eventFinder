import React from 'react'
import './Input.css'
import loadingCircle from './loadingCircle2.gif' 
import userService from './../../services/users'


const Input = (props) => {

    const { 
        isLoading, 
        distance,
        handleSubmitFindByLocation,
        setDistance, 
        setShowTags, 
        isLogged,
        setIsLogged, 
        setShowFavoriteEvents, 
        setShowModal, 
        setShowSignUp, 
        loggedUser,
        setLoggedUser, 
        setShowLogin, 
        favoriteEvents,
        setFavoriteEvents 
    } = props


    // CREATE 1 - 5 DISTANCE OPTIONS FOR DROP-DOWN
    const distanceOptions = () => {

        let optionList = []
        for (let i = 1;i < 6;i++) {
            optionList.push(<option key={i} value={i}>{i} km</option>)
        }
        return optionList
    }

    const handleLogout = async () => {

        await userService.update({
            username:loggedUser.username,
            favorites: favoriteEvents
        } )
        //alert('logout successfull')
        window.localStorage.removeItem('loggedBlogappUser')
        setLoggedUser({})
        setIsLogged(false) 
        setFavoriteEvents([])
        
    }
 
    // ---------------RENDERING INPUT COMPONENT-----------------------------------------

    return  (
        // FORM - FIND BY LOCATION
        <div>
            <div className="inputcontainer" >

                <ul className="inputNavUl">

                <li className="inputNavLi" onClick={() => { setShowTags(true); setShowModal(true) }}> Filter</li>
                
                <li className="inputNavLi" onClick={() => { setShowFavoriteEvents(true); setShowModal(true) }}>Favorites</li>

                <li className="inputNavLi">
                    <select
                     className="inputNavSel"
                     defaultValue={distance}
                     onChange={({ target }) => setDistance(target.value)}> 
                       {distanceOptions()}
                       <option value={20}>Capital area</option>
                   </select> 
               </li>

                <li className="inputNavLi" onClick={handleSubmitFindByLocation} title='Double-click map to set a new center'>{!isLoading ? 'Events' : <img src={loadingCircle} alt="loadingCircle" />}</li>
 
                <li className="inputNavLi" onClick={() => { setShowSignUp(true); setShowModal(true) }}>SignUp</li>
                {!isLogged 
                    ? <li className="inputNavLi" onClick={() => { setShowLogin(true); setShowModal(true) }}>Login</li> 
                    : <li className="inputNavLi" onClick={handleLogout}>Logout {loggedUser.name}</li>}
 
                </ul>
            </div>
        </div>
    )
};

export default Input


 

 
