importScripts("https://www.gstatic.com/firebasejs/8.6.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.6.2/firebase-messaging.js");

console.log("Initialize firebase-sw..");

firebase.initializeApp({
  apiKey: "AIzaSyCeGR44KXMltYy2ktWr-FlllOHuZoZm-ng",
  authDomain: "push-notifications-pwa.firebaseapp.com",
  projectId: "push-notifications-pwa",
  storageBucket: "push-notifications-pwa.appspot.com",
  messagingSenderId: "946274365193",
  appId: "1:946274365193:web:371bc18170555cea2f6dd8",
  measurementId: "G-WZ8XZEKZ8M",
});

// API push: Cuando firebase manda notificación
self.addEventListener("push", function (event) {
    /* Acá se podría hacer una consulta al backend con los detalles de 
    la notificación */
    console.info("Event: Push");
    let title = "Bienvenido!";
    let body = {
      body: "Te has suscrito a las notificaciones",
      tag: "pwa",
      icon: "./images/icon-96x96.png",
    };
    event.waitUntil(self.registration.showNotification(title, body));
  });

const messaging = firebase.messaging();
