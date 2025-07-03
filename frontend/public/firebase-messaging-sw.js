importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyB6RZnfPAqQZYDSpQ0iJ4dApl4orB3Ct1A",
  authDomain: "real-brave-audio.firebaseapp.com",
  projectId: "real-brave-audio",
  storageBucket: "real-brave-audio.firebasestorage.app",
  messagingSenderId: "899942026380",
  appId: "1:899942026380:web:5c3ca1613ad07340b47fa9",
  measurementId: "G-F7VTQLHL67",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
