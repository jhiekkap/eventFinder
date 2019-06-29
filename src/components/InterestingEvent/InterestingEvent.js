import React, { useEffect, useState } from "react";
import "./InterestingEvent.css";
import { timeInfo } from "../../helperFunctions/timeStringShorter.js";

const InterestingEvent = props => {

  const {
    showInterestingEvent,
    setShowInterestingEvent,
    interestingEvent,
    favoriteEvents,
    setFavoriteEvents, 
    setShowFavoriteEvents,
    setShowModal,
    setShowTags
  } = props;

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    console.log("USE EFFECT IN INTERESTING");
    let isThisAlreadyAFavoriteEvent = favoriteEvents
      .map(event => event.id)
      .includes(interestingEvent.id);
    setIsFavorite(isThisAlreadyAFavoriteEvent);
  });

  const handleSetFavorite = () => {
    if (favoriteEvents.map(event => event.id).includes(interestingEvent.id)) {
      let newFavoriteList = favoriteEvents.filter(
        event => event.id !== interestingEvent.id
      );
      setFavoriteEvents(newFavoriteList);
      setIsFavorite(false);
      console.log("FAVORITE EVENTS:", newFavoriteList);
    } else {
      setFavoriteEvents(favoriteEvents.concat(interestingEvent));
      setIsFavorite(true);
      console.log("FAVORITE EVENTS:", favoriteEvents.concat(interestingEvent));
    }
  };

  const createMarkup = () => {
    return { __html: interestingEvent.description.body };
  };

  const showImages = () => {
    if (interestingEvent.description.images) {
      return interestingEvent.description.images.map((image,i) => (
        <img key={i} style={{ maxWidth: "100%" }} src={image.url} />
      ));
    } else {
      return <p>no images</p>;
    }
  };

  const handleShowFavorites = () => {
    setShowInterestingEvent(false);
    setShowFavoriteEvents(true);
  };

  // -----------------RENDERING INTERESTING EVENT COMPONENT-------------------------------------


    return (showInterestingEvent && interestingEvent !== {}) &&
      <div id="whiteContainer">
        <button className="closeButton" onClick={()=>{setShowModal(false);setShowInterestingEvent(false)}}>Close</button>
        <div className="eventHeader">
          {interestingEvent.name.fi}
          <br /> {interestingEvent.location.address.street_address}
          <br />
          <br /> {timeInfo(interestingEvent)}
          <br />
          {interestingEvent.description.intro}
          <br />
        </div>
        <div className="heartDiv" onClick={() => handleSetFavorite()}>
          <i className={isFavorite ? "far fa-heart" : "fas fa-heart"}>
            {isFavorite ? "Remove from favorites" : "Add to favorites"}
          </i>
        </div>
        <button id="interestingEventShowButton" onClick={handleShowFavorites}>
          Show favorites
        </button>
        <button onClick={() => {setShowTags(true);setShowInterestingEvent(false)}}>
          Show filter
        </button>
        <div id="interestingEventBody">
          <div dangerouslySetInnerHTML={createMarkup()} />
          <br />{" "}
          {interestingEvent.info_url ? (
            <a href={interestingEvent.info_url} target="_blank">
              More info
            </a> )
            : ( " "  )}
          <br />
          <div className="interestingImg">{showImages()}</div>
        </div>
      </div>
};


export default InterestingEvent;
