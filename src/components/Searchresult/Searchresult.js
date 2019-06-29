import React, {useState} from "react"
import "./Searchresult.css"

const Searchresult = props => {

    const { events, isFirstTime } = props 

    // SAVING INDEX OF INTERESTING EVENT IN DROP-DOWN LIST TO STATE VARIABLE
    const [eventIndex,
        setEventIndex] = useState('') 


    // CREATE OPTIONS FOR EVENT DROP-DOWN LIST
    const eventOptions = () => {
        return events.map((event, index) => <option key={index} value={index}>{index} {event.name.fi + ' -- ' + event.location.address.street_address + ' -- ' + event.event_dates.starting_day}</option>)
    }

    const showEvents = () => { 

        // HANDLIG CHANGE IN EVENT DROP-DOWN LIST
        const handleChangeInterestingEvent = (e) => {
            setEventIndex(e.target.value)  
          }
        
          //HANDLIG SUBMIT IN EVENT DROP-DOWN LIST
        const handleSubmitInterestingEvent = (e) => {
            e.preventDefault()
            alert(events[eventIndex].name.fi + '\n' + events[eventIndex].location.address.street_address + '\n' + events[eventIndex].event_dates.starting_day + '\n' +  events[eventIndex].description.intro + '\n' +  events[eventIndex].description.body)
           
          }

        // IF NO EVENTS FOUND
        if (events.length === 0 && !isFirstTime) {
            return (
                <div>
                    <p>no events</p>
                </div>
            )
            // IF SOME EVENTS FOUND, CREATE DROP-DOWN FOR LIST OF EVENTS
        } else if (events.length !== 0) {
            return (
                <form onSubmit={handleSubmitInterestingEvent}>
                    <label>
                        Pick your favorite event:
                        <select value={eventIndex} onChange={handleChangeInterestingEvent} >
                            {eventOptions()}
                        </select>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            )
        } 
    }


    // ---------------RENDERING SEARCHRESULT COMPONENT-----------------------------------------

    return (
        <div className="giveMeAClassName">
            {showEvents()}
        </div>
    )
};

export default Searchresult;
