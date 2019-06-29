const month = timeString => {
 
    let months = [
        " Jan ",
        " Feb ",
        " Mar ",
        " Apr ",
        " May ",
        " Jun ",
        " Jul ",
        " Aug ",
        " Sep ",
        " Oct ",
        " Nov ",
        " Dec "
    ];
    return months[new Date(timeString).getMonth()];
}

const day = timeString => { 
    let dayNumber = new Date(timeString).getDate();
    let dayString = dayNumber;
    if (dayNumber === 1) {
        dayString += "st ";
    } else if (dayNumber === 2) {
        dayString += "nd ";
    } else if (dayNumber === 3) {
        dayString += "rd ";
    } else {
        dayString += "th ";
    } 
    return dayString;
};

const hours = timeString => {  
    return new Date(timeString).getHours(); 
}

const amHours = timeString => { 
    let hours = new Date(timeString).getHours();
    if (hours > 12) {
        hours = hours - 12
    }
    return hours === 0 ? '00' : hours
}

const hoursEnding = timeString => { 
    let hoursEnding = " A.M.";
    if (hours(timeString) > 12) {
        hoursEnding = " P.M.";
    }
    return hoursEnding 
}
 
const monthAndDayAndTime = timeString => { 
    let weekDay = new Date(timeString).getDay();  
    let weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday,', 'Sunday']
    return weekDays[weekDay] + month(timeString) + day(timeString) + amHours(timeString) + hoursEnding(timeString)
};

export const monthAndDay = timeString => { 
    return month(timeString) + day(timeString)
}

export const timeInfo = interestingEvent => {

    let startingTime = interestingEvent.event_dates.starting_day
    let endingTime = interestingEvent.event_dates.ending_day
    let infoTime = ''
    if (endingTime === startingTime || !endingTime) {
        infoTime = monthAndDayAndTime(startingTime)
    } else if (day(startingTime) === day(endingTime) && month(startingTime) === month(endingTime)) {

        infoTime = monthAndDay(startingTime) + amHours(startingTime)

        if (hoursEnding(startingTime) !== hoursEnding(endingTime)) {
            infoTime += hoursEnding(startingTime) + ' - ' +
                + amHours(endingTime) + hoursEnding(endingTime)
        } else {
            infoTime +=  ' - ' + amHours(endingTime) + hoursEnding(endingTime)
        } 
    } else {
        infoTime =  monthAndDayAndTime(startingTime) + ' to ' + monthAndDayAndTime(endingTime)
    } 
    return infoTime 
}


