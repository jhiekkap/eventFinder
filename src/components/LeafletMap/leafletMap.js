import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import React, { useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./leafletMap.css";
import { monthAndDay } from "../../helperFunctions/timeStringShorter.js"; 


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("./img/rosaPin.png"),
  iconUrl: require("./img/rosaPin.png"),
  shadowUrl: require("../../../node_modules/leaflet/dist/images/marker-shadow.png"),
  iconSize: [40, 40]
});

const pointerIcon = new L.Icon({
  iconUrl: require("./img/iconLocation.png"),
  iconRetinaUrl: require("./img/iconLocation.png"),
  iconAnchor: [5, 55],
  popupAnchor: [10, -44],
  iconSize: [55, 55],
  shadowUrl: "../assets/marker-shadow.png",
  shadowSize: [68, 95],
  shadowAnchor: [20, 92]
});


const LeafletMap = props => {

  const {
    events,
    location,
    setLocation,
    zoom,
    setZoom,
    setDistance,
    setShowInterestingEvent,
    setInterestingEvent,
    initializing,
    fetchEventsFromServer,
    mouseDown,
    setMouseDown,
    setShowFavoriteEvents,
    setShowModal
  } = props;

  const [eventOptionValue, setEventOptionValue] = useState("");


  const handleChangeChooseEventOfManyInSameLocation = e => {
    setEventOptionValue(e.target.value);
    if (e.target.value !== "Choose event") {
      setInterestingEvent(events.find(event => event.id === e.target.value));
      setShowInterestingEvent(true);
      setShowModal(true);
      setShowFavoriteEvents(false);
    }
  };


  const handleShowInfoOfSingleEventPopup = thisEvent => {
    setEventOptionValue(thisEvent.id);
    setInterestingEvent(thisEvent);
    setShowInterestingEvent(true);
    setShowModal(true);
    setShowFavoriteEvents(false);
  };


  const handleChangeCenter = e => {
    setZoom(e.target._zoom);
    console.log("CHANGED CENTER \n GET ZOOM: ", e.target._zoom);
    console.log("NEW CENTER:\n", e.latlng);
    setLocation(e.latlng);
    let dist = 16 - e.target._zoom;
    dist = dist < 0.5 ? 0.5 : dist;
    let query = `/eventsByCoordinates?lat=${e.latlng.lat}&long=${
      e.latlng.lng
    }&dist=${dist}`;
    fetchEventsFromServer(query);
  };


  const handleMoveEnd = e => {
    console.log("MOVEEND POSITION: ", e.target.getCenter());
    console.log("IS MOUSE DOWN: ", mouseDown);
    if (mouseDown) {
      console.log("MOUSE WAS DOWN 0.75 SEC");
      setMouseDown(false);
      let dist = 16 - e.target._zoom;
      dist = dist < 0.5 ? 0.5 : dist;
      let query = `/eventsByCoordinates?lat=${e.target.getCenter().lat}&long=${
        e.target.getCenter().lng
      }&dist=${dist}`;
      fetchEventsFromServer(query);
    }
  };


  const handleMouseDown = e => {
    console.log("MOUSEDOWN POSITION:\n", e.latlng);
    setTimeout(() => setMouseDown(true), 750);
    setTimeout(() => setMouseDown(false), 3000);
  };


  const handleChangeZoom = e => {
    console.log("OLD ZOOM: ", zoom);
    console.log("CHANGED ZOOM: ", e.target._zoom);
    console.log("POSITION OF CHANGE ZOOM: ", e.target._animateToCenter);
    setZoom(e.target._zoom);
    let dist = 16 - e.target._zoom;
    dist = dist < 0.5 ? 0.5 : dist;
    setDistance(parseInt(dist));
    if (e.target._zoom < zoom) {
      let query = `/eventsByCoordinates?lat=${
        e.target._animateToCenter.lat
      }&long=${e.target._animateToCenter.lng}&dist=${dist}`;
      fetchEventsFromServer(query);
    }
  };

 
  

  const showManyEventsInSameLocation = eventsInSameAddress => {
    return (
      <div>
        <form>
          <label>
            <select 
              value={eventOptionValue}
              onChange={handleChangeChooseEventOfManyInSameLocation}
            >
              <option  >Choose event</option>
              {eventsInSameAddress.map(event => (
                <option  key={event.id} value={event.id}>
                  {event.name.fi} {monthAndDay(event.event_dates.starting_day)}
                </option>
              ))}
            </select>
          </label>
        </form>
      </div>
    );
  };

  // PUTTING FOUND EVENTS TO MAP AS MARKERS
  const markerFactory = () => {

    let list = [];
    for (let i = 0; i < events.length; i++) {
      // TESTING IF MANY EVENTS IN THE SAME LOCATION
      if (
        events.length > 1 &&
        i < events.length - 1 &&
        events[i + 1].location.address.street_address ===
          events[i].location.address.street_address
      ) {
        let eventsInSameAddress = [];
        eventsInSameAddress.push(events[i]);
        while (
          i < events.length - 1 &&
          events[i + 1].location.address.street_address ===
            events[i].location.address.street_address
        ) {
          eventsInSameAddress.push(events[i + 1]);
          i++;
        }
        list.push(
          <Marker
            key={i}
            position={{
              lat: events[i].location.lat,
              lng: events[i].location.lon
            }}
          >
            <Popup closeButton={false}>
              {showManyEventsInSameLocation(eventsInSameAddress)}
            </Popup>
          </Marker>
        );
      } else {
        list.push(
          <Marker
            key={i}
            position={{
              lat: events[i].location.lat,
              lng: events[i].location.lon
            }}
          >
            <Popup closeButton={false}>
              {events[i].name.fi}
              {monthAndDay(events[i].event_dates.starting_day)}
              <button
                onClick={() => handleShowInfoOfSingleEventPopup(events[i])}
              >
                More info
              </button>
            </Popup>
          </Marker>
        );
      }
    }
    return list;
  };

  //------------------------RENDERING MAP------------------------------------------------------

  return (
    !initializing && (
      // INITIALIZE MAP
      <div
        id="map"
        style={{ zIndex: 1 }}
        title="Double-click map to set a new center"
      >
        <Map
          /* id="map" */
          maxBounds={[[60.372, 24.526], [60.087, 25.363]]}
          center={location}
          /* minZoom={15} */
          zoom={zoom}
          zoomControl={false}
          /* touchZoom={false}  */
          doubleClickZoom={false}
          onzoomend={handleChangeZoom}
          zoomSnap={0.5}
          ondblclick={handleChangeCenter}
          //onclick={handleGoToMap}
          onmousedown={handleMouseDown}
          onmoveend={handleMoveEnd}
          zIndex={1}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* THIS IS OUR POSITION MARKER */}
          <Marker icon={pointerIcon} position={location}>
            <Popup>
              We are here! <br /> This is our position!
            </Popup>
          </Marker>

          {/* CALL MARKER FUNCTION TO PUT ALL EVENTS TO MAP */}
          {markerFactory()}
        </Map>
      </div>
    )
  );
};


export default LeafletMap;
