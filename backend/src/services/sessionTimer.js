let tempSessionInterval;

const sessionCountdownTimer = (io, initialHours = 0, initialMinutes = 59, initialSeconds = 60) => {
    let hours = initialHours;
    let minutes = initialMinutes;
    let seconds = initialSeconds;

    const sessionInterval = setInterval(() => {
        if (seconds > 0) {
            io.emit('session-timer', { hours, minutes, seconds });
            seconds--;
        } else if (seconds === 0 && minutes > 0) {
            minutes--;
            seconds = 59;
            io.emit('session-timer', { hours, minutes, seconds });
        } else if (seconds === 0 && minutes === 0 && hours > 0) {
            hours--;
            minutes = 59;
            seconds = 59;
            io.emit('session-timer', { hours, minutes, seconds });
        } else if (seconds === 0 && minutes === 0 && hours === 0) {
            io.emit('session-timer', { hours, minutes, seconds });
            clearInterval(sessionInterval);
            io.emit('timer-finished'); // Notify that the timer has finished
        }

        // Notify when 1 minute is left
        // if (hours === 0 && minutes === 1 && seconds === 0) {
        //     io.emit('one-minute-left', {sessionEnding:true});
        // }
    }, 1000);
    
    tempSessionInterval = sessionInterval;
};

const logoutStopTimer = () => {
    clearInterval(tempSessionInterval);
    tempSessionInterval = null;  // Clear the interval reference
};

module.exports = { sessionCountdownTimer, logoutStopTimer };
