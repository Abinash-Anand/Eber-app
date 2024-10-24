// const Session = require('../models/sessionModel'); // Assuming your session model is here
// const redis = require('redis');
// require('dotenv')
// const pub = redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }); // Redis Pub/Sub client

// let tempSessionInterval;

// const sessionController = {
//   /**
//    * Starts the session countdown timer for a user
//    */
//   sessionCountdownTimer: (userId, sessionId, initialHours = 0, initialMinutes = 59, initialSeconds = 60) => {
//     let hours = initialHours;
//     let minutes = initialMinutes;
//     let seconds = initialSeconds;

//     // Save the remaining time every minute
//     let autoSaveInterval = setInterval(async () => {
//       await sessionController.saveRemainingTime(userId, sessionId, hours, minutes, seconds);
//     }, 60000); // Auto-save every 60 seconds

//     const sessionInterval = setInterval(() => {
//       // Redis Pub/Sub or session logic here if needed
//       if (seconds > 0) {
//         seconds--;
//       } else if (seconds === 0 && minutes > 0) {
//         minutes--;
//         seconds = 59;
//       } else if (seconds === 0 && minutes === 0 && hours > 0) {
//         hours--;
//         minutes = 59;
//         seconds = 59;
//       } else if (seconds === 0 && minutes === 0 && hours === 0) {
//         clearInterval(sessionInterval);
//         clearInterval(autoSaveInterval);

//         // Publish that the session has expired
//         pub.publish('session-expired', JSON.stringify({ userId, sessionId }));

//         // Mark the session as inactive
//         sessionController.markSessionInactive(sessionId);
//       }
//     }, 1000);

//     tempSessionInterval = sessionInterval;
//   },

//   /**
//    * Saves the remaining time in the database
//    */
//   saveRemainingTime: async (userId, sessionId, hours, minutes, seconds) => {
//     try {
//       await Session.updateOne(
//         { sessionId: sessionId },
//         {
//           remainingTime: { hours, minutes, seconds },
//           lastUpdated: new Date(),
//         }
//       );
//       console.log(`Session for user ${userId} updated in DB`);
//     } catch (error) {
//       console.error('Error saving session time:', error);
//     }
//   },

//   /**
//    * Marks a session as inactive in the database
//    */
//   markSessionInactive: async (sessionId) => {
//     try {
//       await Session.updateOne({ sessionId: sessionId }, { isActive: false });
//       console.log(`Session ${sessionId} marked as inactive.`);
//     } catch (error) {
//       console.error('Error marking session as inactive:', error);
//     }
//   },

//   /**
//    * Resumes active sessions after server restart
//    */
//   resumeSessionsAfterRestart: async () => {
//     try {
//       const activeSessions = await Session.find({ isActive: true });
//       activeSessions.forEach((session) => {
//         const remainingTime = session.remainingTime;
//         const expiresAt = new Date(session.expiresAt);
//         const now = new Date();

//         // If session hasn't expired, resume the countdown
//         if (expiresAt > now) {
//           const remainingSeconds = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);
//           const hours = Math.floor(remainingSeconds / 3600);
//           const minutes = Math.floor((remainingSeconds % 3600) / 60);
//           const seconds = remainingSeconds % 60;

//           // Resume the countdown
//           sessionController.sessionCountdownTimer(session.userId, session.sessionId, hours, minutes, seconds);
//         } else {
//           // If the session has already expired, mark it inactive
//           sessionController.markSessionInactive(session.sessionId);
//         }
//       });
//     } catch (error) {
//       console.error('Error resuming sessions:', error);
//     }
//   },

//   /**
//    * Starts a background job for cleaning up expired sessions
//    */
//   startSessionCleanupJob: () => {
//     setInterval(async () => {
//       const now = new Date();
//       try {
//         const expiredSessions = await Session.updateMany(
//           { expiresAt: { $lt: now }, isActive: true },
//           { isActive: false }
//         );
//         console.log(`${expiredSessions.nModified} sessions marked as inactive.`);
//       } catch (error) {
//         console.error('Error during session cleanup:', error);
//       }
//     }, 300000); // Run cleanup every 5 minutes
//   },
// };

// module.exports = sessionController;
