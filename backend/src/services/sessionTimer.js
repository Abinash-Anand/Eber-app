// Set the countdown time in hours, minutes, and seconds
let hours = 0;    // Example: 1 hour
let minutes = 19;  // Example: 0 minutes
let seconds = 60;  // Example: 0 seconds

// Convert total time to seconds
// let totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

const sessionCountdownTimer = (io) => {
    setInterval(() => {
        if (seconds > 0) {
            io.emit('session-timer', {hours, minutes, seconds})
            seconds--
        } else if (seconds === 0) {
            minutes--
            io.emit('session-timer', {hours, minutes, seconds})
            seconds = 60;
        } else if (minutes === 0) {
            io.emit('session-timer', {hours, minutes, seconds})
            return;
        }
        
    }, 1000);
}
module.exports = {sessionCountdownTimer}