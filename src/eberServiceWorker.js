self.addEventListener('push', function(event) {
  const options = {
    body: event.data.text(),
    icon: 'assets/icons/icon-192x192.png',
    badge: 'assets/icons/icon-72x72.png'
  };

  event.waitUntil(
    self.registration.showNotification('New Notification', options)
  );
});
