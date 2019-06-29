import React from "react";
import "./Favorites.css";
import { timeInfo } from "../../helperFunctions/timeStringShorter";
import bin from "./icons8-trash-32.png";
import info from "./icons8-info-26.png";

const Favorites = props => {
  const {
    favoriteEvents,
    setFavoriteEvents,  
    setInterestingEvent,
    setShowInterestingEvent,
    showFavoriteEvents,
    setShowFavoriteEvents,
    setShowModal
  } = props;


  const deleteFavoriteEvent = e => {
    console.log("DELETING EVENT ID: ", e.target.id);
    let updatedFavoriteEventsList = favoriteEvents.filter(
      event => event.id !== e.target.id
    );
    console.log("UPDATED FAVORITES LIST: ", updatedFavoriteEventsList);
    console.log("PROPS: ", props);
    setFavoriteEvents(updatedFavoriteEventsList);
  };


  const showInfoAboutEvent = e => {
    console.log("INFO ABOUT :", e.target.id);
    setShowFavoriteEvents(false);
    setShowInterestingEvent(true);
    setInterestingEvent(favoriteEvents.find(event => event.id === e.target.id));
  };

  
  const showFavoriteList = () => {
    
    return favoriteEvents.map(event => (
      <tr key={event.id}>
        <th>{event.name.fi}</th>
        <th>{timeInfo(event)}</th>
        <th>
          <img id={event.id} onClick={showInfoAboutEvent} src={info} alt='info' />
          <img id={event.id} onClick={deleteFavoriteEvent} src={bin} alt='bin'/>
        </th>
      </tr>
    ));
  };
 


    return (showFavoriteEvents && favoriteEvents.length > 0) ?
      <div id="whiteContainer">
        <button className="closeButton"  onClick={() => {  setShowModal(false); setShowFavoriteEvents(false); }}>
          Close
        </button>
        <h3>My favorite events:</h3>
        <table><tbody>{showFavoriteList()}</tbody></table>
      </div> 

  : showFavoriteEvents &&

      <div id="favoriteEvents">
        <button className="closeButton"
          onClick={() => {
            setShowModal(false);
            setShowFavoriteEvents(false);
          }}
        >
          Close
        </button>
        No favorite events
      </div>
     
};

export default Favorites;
