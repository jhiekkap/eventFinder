import React, {useState} from "react";
import { timeInfo } from "../../helperFunctions/timeStringShorter"; 
import altHelsinki from "./1246_l_kaunis_helsinki_240.jpg"
import "./Tags.css";
import loadingCircle from './../Input/loadingCircle2.gif'

const Tags = props => { 

  const {
    allTags,
    setAllTags,
    showTags,
    events,
    setEvents,
    allEvents,
    setShowModal,
    setShowTags,   
    textSearch,
    setTextSearch,
    setInterestingEvent,
    setShowInterestingEvent,
    timeFilter,
    setTimeFilter,
    firstTimeHere,
    setFirstTimeHere,
    fetchEventsFromServer,
    location,
    setZoom,
    isLoading,
    setIsLoading,
    distance,
    setDistance
  } = props;

 const [showIndex, setShowIndex] = useState(0)
 const [showAll, setShowAll] = useState(false)

const filterByTags = newTagList => {
 
    /// FILTER EVENTS TO SHOW BY TAGS
    let interestingEventsList = [];
    for (let event of allEvents) {
      for (let tag of event.tags) {
        if (
          newTagList
            .filter(tag => tag.value === true)
            .map(tag => tag.name)
            .includes(tag.name.toLowerCase())
        ) {
          interestingEventsList.push(event);
          break;
        }
      }
    }  
    ///REMOVE DUPLICATES
    let uniqueInterestingEventsList = [];
    interestingEventsList.forEach(event => {
      !uniqueInterestingEventsList.map(event => event.id).includes(event.id) &&
        uniqueInterestingEventsList.push(event);
    });
 
    console.log(uniqueInterestingEventsList.length, 'EVENTS LEFT AFTER FILTER BY TAGS')
    return uniqueInterestingEventsList 
}



  const handleTagsDropdownChange = e => {
 
    console.log("CHOOSE TAG: ", e.target.value);
    

    /// FILTER BY TAGS DROPDOWN
    let newTagList = []

    if (e.target.value === 'EVERYTHING') {
      newTagList = allTags.map(tag => ({ name: tag.name, value: true })) 
    } else if (e.target.value === 'NOTHING') {
      newTagList = allTags.map(tag => ({ name: tag.name, value: false })) 
    } else {  
      newTagList = allTags.map(tag => tag.name === e.target.value
        ? { name: e.target.value, value: !tag.value } : tag)  
    }
    console.log('TRUE: ', newTagList.filter(tag => tag.value === true).length)
    console.log('FALSE: ', newTagList.filter(tag => tag.value === false).length)
    
    let newInterestingEventsList = filterByTags(newTagList)
    
    setShowIndex(0)
    setAllTags(newTagList); 
    setFirstTimeHere(false)
    filterByTime(timeFilter, newInterestingEventsList)
 
  };


  const filterOnlyToday = (eventsList) => {
      
    let onlyTodaysEvents = [];
     
    for (let event of eventsList) { 
      if (new Date(event.event_dates.starting_day) === new Date() 
        && new Date(event.event_dates.ending_day) === new Date() ) {
          onlyTodaysEvents.push(event)
      }
    }
    return onlyTodaysEvents 
  }

  const filterAlsoToday = (eventsList) => {
 
    let alsoTodaysEvents = [];
    for (let event of eventsList) {
      if (new Date(event.event_dates.starting_day) <= new Date()
       && new Date(event.event_dates.ending_day) >= new Date()) {
        alsoTodaysEvents.push(event)
      }
    }
    return alsoTodaysEvents 
  };

  function getNumberOfWeek(today) {
    //const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }


  const filterThisWeek = (eventsList) => {
  
    let thisWeeksEvents = []
    for (let event of eventsList) {
      if (getNumberOfWeek(new Date(event.event_dates.starting_day)) === getNumberOfWeek(new Date())
        || getNumberOfWeek(new Date(event.event_dates.ending_day)) === getNumberOfWeek(new Date())) {
        thisWeeksEvents.push(event)
      } else if (new Date(event.event_dates.starting_day) <= new Date()
        && getNumberOfWeek(new Date(event.event_dates.ending_day)) === getNumberOfWeek(new Date())) {
        thisWeeksEvents.push(event)
      }
    }
    return thisWeeksEvents 
  }

const filterByTime = (time, eventsList) => {

  let newInterestingEventsList = []
  if (time === 'onlyToday') {
    newInterestingEventsList = filterOnlyToday(eventsList) 
  } else if (time === 'alsoToday') {
    newInterestingEventsList = filterAlsoToday(eventsList) 
  } else if (time === 'thisWeek') {
    newInterestingEventsList = filterThisWeek(eventsList) 
  } else if (time === 'allTimes') {
    newInterestingEventsList = eventsList 
  } 
  console.log(newInterestingEventsList.length, 'EVENTS OF' , allEvents.length,  'AFTER FILTER BY TIME')
  setEvents(newInterestingEventsList) 
}


  const handleChooseTimeDropDown = e => {

    console.log('TIME OPTIONS:', e.target.value)
   
    let newInterestingEventsList = []

    if(!firstTimeHere) {
      newInterestingEventsList = filterByTags(allTags) 
   } else {
     newInterestingEventsList = filterByTags(allTags.map(tag => ({name: tag.name, value: true})))
   }

   setShowIndex(0)
   setTimeFilter(e.target.value)
   filterByTime(e.target.value, newInterestingEventsList) 
    
  };


const filterByTextSearch = (word, eventList) => {
 
  let filteredByTextSearchEvents = eventList.filter(event => event.name.fi ? event.name.fi.toLowerCase().substring(0, word.length) === word : event.name.en.toLowerCase().substring(0, word.length) === word)
  return filteredByTextSearchEvents
}


  const handleTextSeachChange = e => {
    console.log('TEXT SEARCH: ', e.target.value)
     
    let word = e.target.value 
    setTextSearch(word) 

    let newInterestingEventsList = [] 
     
    console.log('EKA KERTA ?', firstTimeHere)
    if(!firstTimeHere) {
       newInterestingEventsList = filterByTags(allTags) 
    } else {
      newInterestingEventsList = filterByTags(allTags.map(tag => ({name: tag.name, value: true})))
    }

    console.log(newInterestingEventsList.length, 'AFTER FILTER BY TAGS') 
   
    let filteredByTextSearchEvents = filterByTextSearch(word, newInterestingEventsList)
    console.log(filteredByTextSearchEvents.length, 'AFTER FILTER BY TEXT SEARCH')
     
    setShowIndex(0)
    filterByTime(timeFilter, filteredByTextSearchEvents) 
  }


  const showInfoAboutEvent = e => {
    console.log("INFO ABOUT :", e.target.id);
    setShowTags(false);
    setShowInterestingEvent(true);
    setInterestingEvent(events.find(event => event.id === e.target.id));
  };


  const handleShowAll = () => {
     
    setEvents(allEvents)
    setTimeFilter('allTimes')
    setFirstTimeHere(true)
    setAllTags(allTags.map(tag => ({name: tag.name, value: false})))
    setTextSearch('')
    setShowIndex(0) 
  }


    /// COMPARE FUNCTION FOR ARRAY SORT()
    const compareStartingTimes = (a, b) => {
      return new Date(a.event_dates.starting_day) < new Date(b.event_dates.starting_day) ? -1 : new Date(a.event_dates.starting_day) > new Date(b.event_dates.starting_day) ? 1 : 0
    }
    

  const showListOfEvents = () => {

    console.log(events.length)
    let sortedEvents = events
    sortedEvents.sort(compareStartingTimes) 
    let from;let to;
    if(!showAll){
      from = 1 ; to = sortedEvents.length;
    if(to > 20){
      from = 1 + 20 * showIndex
      if(from + 19 < to){
        to = from + 19
      } else {
        to = from + sortedEvents.length % 20 - 1
      } 
      sortedEvents = sortedEvents.slice(from , to)
    }
    }

    
      
    return (
      <div> 
        <br /><br />
        
        {sortedEvents.length > 0 ? <div className="eventGridText"> 
        <span className="header"> 
        <span className="Desktop">
          Showing {sortedEvents.length === allEvents.length ? `all ${allEvents.length} events` 
        : sortedEvents.length === 0 ? `none of ${allEvents.length} events` 
        :  `${from} to ${to} of chosen ${events.length} events of all ${allEvents.length} events`} 
         {events.length > 20 && 
        <span>
        <span className="arrows" onClick={() => setShowIndex(showIndex > 0 && showIndex - 1)}>&nbsp;&nbsp; &lt;&nbsp;&nbsp;</span>
        <span className="arrows" onClick={() => setShowIndex(showIndex < events.length / 20 - 1 && showIndex + 1)}>&nbsp;&gt;</span>
        </span>}
        <span className="linkki" onClick={() => setShowAll(!showAll)}>&nbsp;&nbsp;{!showAll ? 'Show all' : 'Show only 20'}</span>
        </span>

        <span className="Mobile">
          {`${from} - ${to} / ${events.length} (${allEvents.length})`}
        

        {events.length > 20 && 
        <span>
        <span className="arrows" onClick={() => setShowIndex(showIndex > 0 && showIndex - 1)}>&nbsp;&nbsp; &lt;&nbsp;&nbsp;</span>
        <span className="arrows" onClick={() => setShowIndex(showIndex < events.length / 20 - 1 && showIndex + 1)}>&nbsp;&gt;</span>
        </span>}
        </span> 
        </span>
          <div id="imageBoxContainer">

            {sortedEvents.map((event, i) => <div key={i} className="eventBox">
              {event.description.images.length ? <img id={event.id} onClick={showInfoAboutEvent} className="eventBoxImg" key={i} style={{ maxWidth: "100%" }} src={event.description.images[0].url} alt={event.name.fi || event.name.en}/>
                : <img src={altHelsinki} onClick={showInfoAboutEvent} />}
              <br />{event.name.fi}<br />{timeInfo(event)}
            </div>)}
          </div>
        </div> 
        : <div>No events</div>}
      
      </div>
    )
  }
  

  const handleChangeOfAreaOptions = e => {

    let query = `/eventsByCoordinates?lat=${location.lat}&long=${location.lng}&dist=${e.target.value}`;
    
    let zoomList = [1,2,3,3.5,4,4.5,1,1,1,1,1,1,1,1,1,1,1,1,1,5]
    setZoom(16 - zoomList[e.target.value - 1]);
    setDistance(16 - zoomList[e.target.value - 1])
    fetchEventsFromServer(query);
    console.log('DISTANCE:', e.target.value) 
  }

 


  // ---------------RENDERING TAGS COMPONENT-----------------------------------------
 
  return (showTags && events && allTags) &&
    //return (showTags && events !== [] && allTags !== []) &&

      <div className="tagscontainer"> 

        <div className="filterContainer"> 

          <ul className="tagsNavUl">

            {/* //// 1 'ENTER' BUTTON - GO BACK TO MAP  */}
            <li className="tagNavLi1" >
              <p className="labelBold linkki" onClick={() => { setShowModal(false); setShowTags(false); }}>SHOW ON MAP</p>
              {isLoading && <img src={loadingCircle} alt="loadingCircle" />}
              <p className="labelBold linkki" onClick={handleShowAll}>Reset filters</p>
            </li>


            {/*  /// 2 TIME OPTIONS */}
            <li className="tagNavLi2" >
              <label className="labelBold">When</label>
              <select defaultValue="allTimes" size={4} onChange={handleChooseTimeDropDown}>
                <option value='allTimes'>All times</option>
                <option value='onlyToday'>Only Today</option>
                <option value='alsoToday'>Also Today</option>
                <option value='thisWeek'>This week</option>
              </select>
            </li>


            {/* /// 3 TEXT SEARCH - MAYBE NOT IN MOBILE PHONE??? */}
            <li className="tagNavLi3 Desktop" >
              <input id="textSearchInput"type='text' placeholder="search" value={textSearch} onChange={handleTextSeachChange} />
            </li>


            {/*    //////  4 SELECT INTERESTING TAGS DROP-DOWN  FOR DESKTOP*/}
            <li className="tagNavLi4 Desktop" >
              <label className="labelBold">What are you interested in? </label>
              <select 
                multiple={true} 
                size={15} 
                value={allTags.filter(tag => tag.value === true).map(tag => tag.name)}
                //value={allTags.map(tag => tag.name)}
                onChange={handleTagsDropdownChange}>
                <option value="EVERYTHING">EVERYTHING</option>
                <option value="NOTHING">NOTHING</option>
                {allTags.map((tag, i) => (
                  <option key={i} value={tag.name}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </li>


            {/*    //////  4 SELECT INTERESTING TAGS DROP-DOWN  FOR MOBILE*/} 
            <li className="tagNavLi4 Mobile" >
              <label className="labelBold">What are you interested in?</label>
                <select multiple={true} size={8} 
                value={allTags.filter(tag => tag.value === true).map(tag => tag.name)}
                //value={allTags.map(tag => tag.name)} 
                onChange={handleTagsDropdownChange}> 
                    <option>EVERYTHING</option>
                    <option>NOTHING</option>
                  {allTags.map((tag, i) => (
                    <option key={i} value={tag.name}>
                      {tag.name}
                    </option>
                  ))}
                </select>
            </li>


              {/* //// 5 SEARCH AREA - FROM THIS OR WHOLE CAPITAL AREA */}
              <li className="tagNavLi5" >
                <label className="labelBold">Distance</label>
                <select defaultValue={distance} size={6} onChange={handleChangeOfAreaOptions}>
                  <option value={1}>1 km</option>
                  <option value={2}>2 km</option>
                  <option value={3}>3 km</option>
                  <option value={4}>4 km</option>
                  <option value={5}>5 km</option>
                  <option value={20}>Capital area</option>
                </select>
              </li>
 
          </ul>

        </div>

          <div className="eventList"> 
            {/*  ////SHOW LIST OF INTERESTING TAGS OR SHOW LIST OF ALL FILTERED EVENTS */}
            {showListOfEvents()}
          </div>

        </div> 
    };
    
    export default Tags;
    
/* <li className="tagNavLi" onClick={handleTextSearchSubmit}>Show</li> */
        
/* <li className="tagNavLi" onClick={handleTextSearchSubmit}>Show</li> */
        
        
        /*  /// TAGS DROP-DOWN */
        
        /* OLDER VERSION */
        /* return (
  <div className="tagscontainer">
          <div className="tagsdiv 1">
            {showTagsDivFromTo(0, 4)}
          </div>
          <div className="tagsdiv 2">
            {showTagsDivFromTo(4, 4)}
          </div>
          <div className="tagsdiv 3">
            {showTagsDivFromTo(8, 4)}
          </div>
          <div className="tagsdiv 4">
            {showTagsDivFromTo(12, 4)}
          </div>
        </div>
        )
        */
        
        /* THE OLDEST VERSION: */
        /* return (
  <div className="tagscontainer">
          <div className="tagsdiv 1">
            <div>
              <input type="checkbox" id="students" />
              <label htmlFor="students">Students</label>
            </div>
            <div>
              <input type="checkbox" id="courses" />
              <label htmlFor="courses">Courses</label>
            </div>
            <div>
              <input type="checkbox" id="concerts" />
              <label htmlFor="concerts">Concerts</label>
            </div>
            <div>
              <input type="checkbox" id="exhibitions" />
              <label htmlFor="exhibitions">Exhibitions</label>
            </div>
          </div>
          <div className="tagsdiv 2">
            <div>
              <input type="checkbox" id="festivals" />
              <label htmlFor="festivals">Festivals</label>
            </div>
            <div>
              <input type="checkbox" id="lectures" />
              <label htmlFor="lectures">Lectures</label>
            </div>
            <div>
              <input type="checkbox" id="music" />
              <label htmlFor="music">Music</label>
            </div>
            <div>
              <input type="checkbox" id="sports" />
              <label htmlFor="sports">Sports</label>
            </div>
          </div>
          <div className="tagsdiv 3">
            <div>
              <input type="checkbox" id="photography" />
              <label htmlFor="photography">Photography</label>
            </div>
            <div>
              <input type="checkbox" id="theatre" />
              <label htmlFor="theatre">Theatre</label>
            </div>
            <div>
              <input type="checkbox" id="libraries" />
              <label htmlFor="libraries">Libraries</label>
            </div>
            <div>
              <input type="checkbox" id="art" />
              <label htmlFor="art">Art</label>
            </div>
          </div>
          <div className="tagsdiv 4">
            <div>
              <input type="checkbox" id="hobbies" />
              <label htmlFor="hobbies">Hobbies</label>
            </div>
            <div>
              <input type="checkbox" id="charity" />
              <label htmlFor="charity">Charity</label>
            </div>
            <div>
              <input type="checkbox" id="culture" />
              <label htmlFor="culture">Culture</label>
            </div>
            <div>
              <input type="checkbox" id="museums" />
              <label htmlFor="museums">Museums</label>
            </div>
          </div>
        </div>
        )
        
         */
        
        /* // CREATE CHECKBOX GROUPS FROM TAG LIST
 const showTagsDivFromTo = (startIndex, howMany, tagList) => {
          let thisTagGroupList = [];
        tagList.sort(compare);
   for (let i = startIndex; i < startIndex + howMany; i++) {
          let tag = tagList[i];
        thisTagGroupList.push(
       <div key={tag.name}>
          <input
            checked={tag.value}
            onChange={handleCheckABox}
            type="checkbox"
            id={tag.name}
          />
          <label htmlFor={tag.name}>{tag.name}</label>
        </div>
        );
      }
      return thisTagGroupList;
    }; */
   
   /* // CREATE TAG GROUPS
const showTagGroups = (howMany, tagList) => {
          let modulo = tagList.length % howMany;
        //console.log('modulo before:', modulo)
        //tagList.sort()
  while (modulo !== 0) {
          tagList.push(tagList[modulo]);
        modulo = tagList.length % howMany;
        //console.log('modulo in while loop:', modulo)
      }
      //console.log('modulo after:', modulo)
      let tagGroupsList = [];
  for (let i = 0; i < howMany; i++) {
          let cName = `tagsdiv ${i + 1}`;
        tagGroupsList.push(
      <div>
          <div key={i} className={cName}>
            {showTagsDivFromTo(
              i * (tagList.length / howMany),
              tagList.length / howMany,
              tagList
            )}
          </div>
        </div>
        );
      }
      return tagGroupsList;
    };
    */
/* <input //// CHECK ONLY TODAY
          checked={onlyToday}
          onChange={handleCheckATimeBox}
          type="checkbox"
          id='onlyToday'
        />
        <label htmlFor='onlyToday'>Only today</label>

        <input //// CHECK ALSO TODAY
          checked={alsoToday}
          onChange={handleCheckATimeBox}
          type="checkbox"
          id='alsoToday'
        />
        <label htmlFor='alsoToday'>Also today</label>

        <input  ///CHECK THIS WEEK
          checked={thisWeek}
          onChange={handleCheckATimeBox}
          type="checkbox"
          id='thisWeek'
        />
        <label htmlFor='thisWeek'>This week</label> */


/* const showAllTagsCheckBoxes = () => {
return allTags.map(tag  =>
<div key={tag.name}>
          <input
            checked={tag.value}
            onChange={handleCheckABox}
            type="checkbox"
            id={tag.name}
          />
          <label htmlFor={tag.name}>{tag.name}</label>
        </div>
        );
        }; */
        
        
        // HANDLE CHECK ALL
/*  const handleChangeCheckAll = () => {
          setIsAllChecked(!isAllChecked);
        let updatedTagList = [];
        allTags.forEach(tag =>
     updatedTagList.push({name: tag.name, value: !isAllChecked })
      );
      setAllTags(updatedTagList);
   {!isAllChecked ? setEvents(allEvents) : setEvents({})}
        if(!isAllChecked){
        }
        }; */
       
       
       
/* const handleCheckABox = e => {

          // CHANGE CHECKED TAGS VALUE TO OPPOSITE & UPDATE ALLTAGS
          let newTagList = allTags.map(tag => tag.name === e.target.id ? {name: tag.name, value:!tag.value} : tag)
      
        updateEvents(newTagList)
        setAllTags(newTagList)
      
      }; */
      
 /*   ////CHOOSE LIST OR DROP-DOWN */ 
        /*    <li className="tagNavLi" onClick={() => setShowAllTags(!showAllTags)}>
            {showAllTags ? "Show list" : "Show checkboxes"} </li> */ 

         /*    ///SHOW CHECK-BOXES */ 

         /*  {showAllTags ? (
            <div>
              <input
                type="checkbox"
                onChange={handleChangeCheckAll}
                id="checkAll"
                checked={isAllChecked}
              />
              <label htmlFor="checkAll">
                {isAllChecked ? "CLEAR ALL" : "CHECK ALL"}
              </label>
              {showAllTagsCheckBoxes()}
            </div>
          ) : (
            ""
          )} */
        
/* const compareEventsByName = (a, b) => {
    if (a.name.fi < b.name.fi) {
      return -1;
    }
    if (a.name.fi > b.name.fi) {
      return 1;
    }
    return 0;
  }; */


/* const compareTags = (a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}; */


/* const updateEvents = tagList => {
  /// FIND ALL TAG MATCHES FROM ALL EVENTS OF THIS AREA
  let interestingEventsList = [];
  for (let event of allEvents) {
    for (let tag of event.tags) {
      if (
        tagList
          .filter(tag => tag.value === true)
          .map(tag => tag.name)
          .includes(tag.name.toLowerCase())
      ) {
        interestingEventsList.push(event);
      }
    }
  } ///REMOVE DUPLICATES
  let uniqueInterestingEventsList = [];
  /* for(let event of interestingEventsList){
    if(!uniqueInterestingEventsList.map(event => event.id).includes(event.id)){
      uniqueInterestingEventsList.push(event)
    }
  } */
/* interestingEventsList.forEach(event => {
  !uniqueInterestingEventsList.map(event => event.id).includes(event.id) &&
    uniqueInterestingEventsList.push(event);
});

console.log(events.length, "EARLIER CHOSEN EVENTS");
console.log(allEvents.length, "ALL EVENTS");
console.log(uniqueInterestingEventsList.length, "INTERESTING EVENTS");
console.log(allTags.filter(tag => tag.value === true).length, 'INTERESTING TAGS')
setEvents(uniqueInterestingEventsList);
}; */

/*
const compareEventsByName = (a, b) => {
  return a.name.fi < b.name.fi ? -1 : a.name.fi > b.name.fi ? 1 : 0;
}; */

  //objs.sort( compare );

/*   const showInterestingTagList = () => {
    return allTags
      .filter(tag => tag.value === true)
      .map(tag => (
        <tr key={tag.name}>
          <th>{tag.name}</th>
          <th>
            <img id={tag.name} onClick={handleDeleteInterestingTag} src={bin} />
          </th>
        </tr>
      ));
  }; */

/* const handleDeleteInterestingTag = e => {
 console.log("DELETING INTERESTING TAG", e.target.id);
 let newTagList = allTags.map(tag => tag.name === e.target.id ? { name: e.target.id, value: false } : tag)
 //updateEvents(newTagList)
 setAllTags(newTagList)
}; */
