import "./App.css";
import Input from "./components/Input/Input";
import OwnModal from "./components/OwnModal/OwnModal";
import React, { useState, useEffect } from "react";
import LeafletMap from "./components/LeafletMap/leafletMap";

const App = () => {

  // INITIALIZING STATES - LIKE this.state={address:''} USED TO BE

  const [isLogged, setIsLogged] = useState(false);
  const [show, setShow] = useState("helsinki");
  const [showTags, setShowTags] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loggedUser, setLoggedUser] = useState({});
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [interestingEvent, setInterestingEvent] = useState({});
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [showFavoriteEvents, setShowFavoriteEvents] = useState(false);
  const [distance, setDistance] = useState(2);
  const [location, setLocation] = useState({});
  const [zoom, setZoom] = useState(14);
  const [initializing, setInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [allPossibleTags, setAllPossibleTags] = useState({});
  const [showInterestingEvent, setShowInterestingEvent] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showUser, setShowUser] = useState(false)   
  const [textSearch, setTextSearch] = useState('') 
  const [timeFilter, setTimeFilter] = useState('allTimes')
  const [firstTimeHere, setFirstTimeHere] = useState(true)

  // INITIALIZING --- THIS IS RUN ONLY ONCE IN THE BEGINNING -
  //  CHECKING OUR CURRENT POSITION COORDINATES
  useEffect(() => {
    setInitializing(true);
    setIsLoading(true)
    console.log("INITIALIZING----------");

    /* if ("geolocation" in navigator) {
      console.log("geolocation is available");
    } else {
      console.log("geolocation is NOT available");
    } */
    /* navigator.geolocation.getCurrentPosition(position => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      console.log("STARTING LOCATION \nlatitude: " +  position.coords.latitude + " longitude: " + position.coords.longitude);
    }); */
      /* let query = `/eventsByCoordinates?lat=${position.coords.latitude}&long=${
        position.coords.longitude
        }&dist=${distance}`; */
      ///// START FROM CENTER OF HELSINKI
      let LatLng = { lat: 60.19501135150039, lng: 24.943557594049953 }
      setLocation(LatLng)
      let query = `/eventsByCoordinates?lat=${LatLng.lat}&long=${LatLng.lng}&dist=${distance}`;

      fetchEventsFromServer(query);
      setInitializing(false)

      fetch('/allTags')
        .then(response => response.json())
        .then(tags => {
          // object - id = key, name = value 
          let allTagsFromAPI = []
          for (let [key, value] of Object.entries(tags)) { 
            allTagsFromAPI.push({ name: value, value: false})
          }
          setAllPossibleTags(allTagsFromAPI)
          console.log(allTagsFromAPI.length, 'POSSIBLE TAGS IN HELSINKI API')

          setIsLoading(false)
        })
   

  }, []);

  // LOADING EVENTS SPECIFIED IN query FROM HELSINKI API
  // THROUGH OUR BACKEND SERVER
  const fetchEventsFromServer = query => {
    
    setIsLoading(true);
    console.log("LOADING------");
    console.log("query: ", query);
    fetch(query)
      .then(response => response.json())
      .then(body => {
        console.log("----LOADING DONE");
        setIsLoading(false);
        setEvents(body.data);
        setAllEvents(body.data);
        let tagList = [];
        for (let event of body.data) {
          for (let tag of event.tags) {
            if ( !tagList
                .map(tag => tag.name.toLowerCase())
                .includes(tag.name.toLowerCase())) {
              tagList.push({ name: tag.name.toLowerCase(), value: false });
            }
          }
        }
        console.log(tagList.length, "TAGS IN THIS AREA ");
        setAllTags(tagList);
      })
      .catch(error => {
        console.log(error);
      });
  };


  // HANDLING SUBMIT 'FIND BY LOCATION' FROM HESINKI API THROUGH OUR SERVER
  const handleSubmitFindByLocation = () => {
    
    setEvents([]);
    console.log("FIND BY LOCATION\n", "ZOOM: ", (16 - distance), "DISTANCE: ", distance);
    //setZoom(16 - e.target.value);
    let zoomList = [1,2,3,3.5,4,4.5,1,1,1,1,1,1,1,1,1,1,1,1,1,5]
    setZoom(16 - zoomList[distance - 1]);
    //goToIdOnPage("map");
    console.log(
      "FIND CENTER: \n latitude: " +
      location.lat +
      " longitude: " +
      location.lng +
      " distance: " +
      distance
    );
    let query = `/eventsByCoordinates?lat=${location.lat}&long=${location.lng}&dist=${distance}`;
    //setDistance(e.target.value)
    //let query = `http://127.0.0.1:3001/eventsByCoordinates?lat=${location.lat}&long=${location.lng}&dist=${distance}`;
    fetchEventsFromServer(query);
  };

  // ---------------RENDERING THE FRONT PAGE-----------------------------------------
  return show === 'helsinki' ? <div className="imgcontainer">
    <h1 onClick={() => setShow('map')}>Helsinki</h1>
  </div>
    :
    <div>
      <div id="modal">
        <OwnModal
          allTags={allTags}
          setAllTags={setAllTags}
          showTags={showTags}
          setShowTags={setShowTags}
          events={events}
          setEvents={setEvents}
          allEvents={allEvents}
          showInterestingEvent={showInterestingEvent}
          setShowInterestingEvent={setShowInterestingEvent}
          interestingEvent={interestingEvent}
          setInterestingEvent={setInterestingEvent}
          favoriteEvents={favoriteEvents}
          setFavoriteEvents={setFavoriteEvents}
          showFavoriteEvents={showFavoriteEvents}
          setShowFavoriteEvents={setShowFavoriteEvents}
          showModal={showModal}
          setShowModal={setShowModal}
          isLogged={isLogged}
          setIsLogged={setIsLogged}
          loggedUser={loggedUser}
          setLoggedUser={setLoggedUser}
          showSignUp={showSignUp}
          setShowSignUp={setShowSignUp}
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          showUser={showUser}
          setShowUser={setShowUser}  
          textSearch={textSearch}
          setTextSearch={setTextSearch} 
          timeFilter={timeFilter} 
          setTimeFilter={setTimeFilter}
          firstTimeHere={firstTimeHere}
          setFirstTimeHere={setFirstTimeHere}
          fetchEventsFromServer={fetchEventsFromServer}
          location={location}
          setZoom={setZoom}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          distance={distance}
          setDistance={setDistance}
        />

      </div>
      <Input
        handleSubmitFindByLocation={handleSubmitFindByLocation}
        distance={distance}
        setDistance={setDistance}
        isLoading={isLoading}
        setShowTags={setShowTags} 
        setShowFavoriteEvents={setShowFavoriteEvents}
        setIsLogged={setIsLogged}
        isLogged={isLogged}
        loggedUser={loggedUser}
        setLoggedUser={setLoggedUser}
        showModal={showModal}
        setShowModal={setShowModal}
        setShowSignUp={setShowSignUp}
        setShowLogin={setShowLogin} 
        favoriteEvents={favoriteEvents}
        setFavoriteEvents={setFavoriteEvents}
      />
      <LeafletMap
        events={events}
        location={location}
        setLocation={setLocation}
        setDistance={setDistance}
        zoom={zoom}
        setZoom={setZoom}
        setInterestingEvent={setInterestingEvent}
        setShowInterestingEvent={setShowInterestingEvent}
        initializing={initializing}
        fetchEventsFromServer={fetchEventsFromServer}
        mouseDown={mouseDown}
        setMouseDown={setMouseDown}
        setShowFavoriteEvents={setShowFavoriteEvents}
        setShowModal={setShowModal}
      />
    </div>
};
export default App;
