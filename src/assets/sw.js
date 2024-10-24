console.log("Service worker loaded...");

// Handle push events
self.addEventListener('push', (event) => {
  let data;
  try {
    data = event.data.json(); // Try to parse JSON data
  } catch (error) {
    console.error('Error parsing push event data as JSON:', error);
    data = { title: 'Fallback Title', body: 'Fallback body text' };
  }

  console.log('Push event received:', data);

  const options = {
    body: data.body || 'You have a new message!',
    icon: '/assets/icons/icon-192x192.png',  // Optional: set your own icon path
    badge: '/assets/icons/icon-72x72.png',   // Optional: set your own badge icon path (for Android)
    data: {
      url: data.url || '/',  // Optional: pass a URL for the user to navigate to on click
    },
    actions: [
      { action: 'open_url', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'New Notification', options)
  );
});

// Handle notification click events
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const action = event.action;

  if (action === 'open_url' && notification.data.url) {
    clients.openWindow(notification.data.url);  // Open the URL passed in the push notification data
  }

  notification.close();  // Close the notification after the action is handled
});
