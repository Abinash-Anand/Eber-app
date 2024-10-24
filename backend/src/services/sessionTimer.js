const Session = require('../models/sessionModel');
const redis = require('redis');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

// Redis client setup for session management
const redisClient = redis.createClient({ url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` });

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
})();

let tempSessionInterval;

const saveSessionToDB = async (userId, sessionId, hours, minutes, seconds) => {
  const sessionExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
  const newSession = new Session({
    userId: userId,
    sessionId: sessionId,
    expiresAt: sessionExpiresAt,
    remainingTime: { hours, minutes, seconds }
  });

  await newSession.save();
  return sessionId;
};

const startSessionTimer = async (io, sessionId, userId, hours, minutes, seconds) => {
  const sessionKey = `session:${sessionId}`;

  const sessionInterval = setInterval(async () => {
    if (seconds > 0) {
      seconds--;
    } else if (seconds === 0 && minutes > 0) {
      minutes--;
      seconds = 59;
    } else if (seconds === 0 && minutes === 0 && hours > 0) {
      hours--;
      minutes = 59;
      seconds = 59;
    } else if (seconds === 0 && minutes === 0 && hours === 0) {
      clearInterval(sessionInterval);
      clearInterval(tempSessionInterval);

      // Mark session as inactive
      markSessionInactive(sessionId);
    }

    // Update the session in Redis
    redisClient.hSet(sessionKey, { hours, minutes, seconds });

    // Emit updates to the connected client
    if (io) {
      io.emit('session-timer', { hours, minutes, seconds });
    }
  }, 1000);

  tempSessionInterval = sessionInterval;
};

const autoSaveToRedis = (sessionId, userId, hours, minutes, seconds) => {
  const sessionKey = `session:${sessionId}`;

  const autoSaveInterval = setInterval(async () => {
    try {
      const response = await redisClient.hSet(
        sessionKey,
        "hours", hours,
        "minutes", minutes,
        "seconds", seconds,
        "lastUpdated", new Date().toISOString()
      );
      console.log("Redis hSet response: ", response); // Log the Redis response
    } catch (error) {
      console.error("Error saving data to Redis: ", error); // Log any errors
    }
  }, 60000); // Save every minute

  return autoSaveInterval;
};

const markSessionInactive = async (sessionId) => {
  try {
    await Session.updateOne({ sessionId }, { isActive: false });
    console.log(`Session ${sessionId} marked as inactive.`);
  } catch (error) {
    console.error('Error marking session as inactive:', error);
  }
};

const resumeSessionAfterRestart = async () => {
  try {
    const activeSessions = await Session.find({ isActive: true });
    activeSessions.forEach((session) => {
      const sessionKey = `session:${session.sessionId}`;

      redisClient.hGetAll(sessionKey, async (err, redisData) => {
        if (err || !redisData || !Object.keys(redisData).length) {
          // No Redis data, fallback to MongoDB
          startSessionTimer(
            null,
            session.sessionId,
            session.userId,
            session.remainingTime.hours,
            session.remainingTime.minutes,
            session.remainingTime.seconds
          );
        } else {
          // Redis has session data
          startSessionTimer(
            null,
            session.sessionId,
            session.userId,
            Number(redisData.hours),
            Number(redisData.minutes),
            Number(redisData.seconds)
          );
        }
      });
    });
  } catch (error) {
    console.error('Error resuming sessions after restart:', error);
  }
};

const cleanUpExpiredSessions = () => {
  setInterval(async () => {
    const now = new Date();
    try {
      const expiredSessions = await Session.updateMany(
        { expiresAt: { $lt: now }, isActive: true },
        { isActive: false }
      );
      console.log(`${expiredSessions.nModified} sessions marked as inactive.`);
    } catch (error) {
      console.error('Error during session cleanup:', error);
    }
  }, 300000); // Run every 5 minutes
};

const sessionCountdownTimer = async (io, userId, initialHours = 0, initialMinutes = 59, initialSeconds = 60) => {
  const sessionId = uuidv4(); // Create a new session ID

  // Save the session in MongoDB
  await saveSessionToDB(userId, sessionId, initialHours, initialMinutes, initialSeconds);

  // Start the session timer
  startSessionTimer(io, sessionId, userId, initialHours, initialMinutes, initialSeconds);

  // Auto-save the session in Redis every minute
  autoSaveToRedis(sessionId, userId, initialHours, initialMinutes, initialSeconds);

  return sessionId; // Return session ID for reference
};

module.exports = {
  saveSessionToDB,
  startSessionTimer,
  autoSaveToRedis,
  markSessionInactive,
  resumeSessionAfterRestart,
  cleanUpExpiredSessions,
  sessionCountdownTimer
};
