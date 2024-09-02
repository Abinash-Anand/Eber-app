self.addEventListener('push', function(event) {
  console.log('Push event received:', event);
  
    //   const data = event.data ? event.data.text() : 'No payload';
    const data = 'NEW NOTIFICATION'
  const options = {
    body: data, // Use the payload data or default text
  };
    console.log('Notification options:', options); // Log options for debugging

  event.waitUntil(
    self.registration.showNotification('You have a new notification', options)
  );
});
