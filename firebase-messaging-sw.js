// ============================================
// Urban Zayka Admin — Service Worker
// Handles push notifications when app is closed
// ============================================

importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBkgTWZwKcXy5BiCVpppltZWVTW7gIPDbE",
  authDomain: "urban-zayka.firebaseapp.com",
  projectId: "urban-zayka",
  storageBucket: "urban-zayka.firebasestorage.app",
  messagingSenderId: "849575139822",
  appId: "1:849575139822:web:01e6d124f8d78267b196ff"
});

const messaging = firebase.messaging();

// Handle background push notifications
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || '🔔 New Order!', {
    body: body || 'New order received at Urban Zayka',
    icon: icon || '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200, 100, 200],
    tag: 'new-order',
    requireInteraction: true, // stays until dismissed
    actions: [
      { action: 'view', title: '📋 View Order' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  });
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        for (const client of clientList) {
          if (client.url.includes('admin.urbanzayka.in') && 'focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow('https://admin.urbanzayka.in');
      })
    );
  }
});
