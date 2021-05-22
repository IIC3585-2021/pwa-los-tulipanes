const container = document.querySelector(".container");

const config = {
  apiKey: "AIzaSyCeGR44KXMltYy2ktWr-FlllOHuZoZm-ng",
  authDomain: "push-notifications-pwa.firebaseapp.com",
  projectId: "push-notifications-pwa",
  storageBucket: "push-notifications-pwa.appspot.com",
  messagingSenderId: "946274365193",
  appId: "1:946274365193:web:371bc18170555cea2f6dd8",
  measurementId: "G-WZ8XZEKZ8M",
};

// Initialize Firebase
firebase.initializeApp(config);
const messaging = firebase.messaging();

const coffees = [
  { name: "Perspiciatis", image: "images/coffee1.jpg" },
  { name: "Voluptatem", image: "images/coffee2.jpg" },
  { name: "Explicabo", image: "images/coffee3.jpg" },
  { name: "Rchitecto", image: "images/coffee4.jpg" },
  { name: " Beatae", image: "images/coffee5.jpg" },
  { name: " Vitae", image: "images/coffee6.jpg" },
  { name: "Inventore", image: "images/coffee7.jpg" },
  { name: "Veritatis", image: "images/coffee8.jpg" },
  { name: "Accusantium", image: "images/coffee9.jpg" },
];

const showCoffees = () => {
  let output = "";
  coffees.forEach(
    ({ name, image }) =>
      (output += `
                <div class="card">
                  <img class="card--avatar" src=${image} />
                  <h1 class="card--title">${name}</h1>
                  <a class="card--link" href="#">Taste</a>
                </div>
                `)
  );
  container.innerHTML = output;
};

document.addEventListener("DOMContentLoaded", showCoffees);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/combined-sw.js")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}

//---extract the subscription id and send it
// over to the REST service---
function sendSubscriptionIDToServer(token) {
  fetch("http://localhost:8080/subscribers", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subscriptionid: token }),
  }).then(() => {
    fetch("http://localhost:8080/push", {
      method: "get",
    });
  });
}

//---extract the subscription id and send it over to the REST service---
function removeSubscriptionIDFromServer(token) {
  fetch("http://localhost:8080/subscribers/" + token, {
    method: "delete",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

//---subscribe to push notification---
function subscribeToPushNotification() {
  navigator.serviceWorker.ready.then(function (registration) {
    //---to subscribe push notification using pushmanager---
    registration.pushManager
      .subscribe(
        //---always show notification when received---
        {
          userVisibleOnly: true,
          applicationServerKey:
            "BN4QE4tHoFLYq0l5aH4QSy_KZeWHg02xl8OCvxG51QOhQoKfq69mtq4H-cUuodWbid3GLqbxsUOJsaNdgMX0i-o",
        }
      )
      .then(function (subscription) {
        console.log("Push notification subscribed.");
        pushElement.dataset.checked = true;
        return messaging.getToken();
      })
      .then((token) => {
        console.log(token);
        sendSubscriptionIDToServer(token);
      })
      .catch(function (error) {
        pushElement.dataset.checked = false;
        console.error("Push notification subscription error: ", error);
      });
  });
}

//---unsubscribe from push notification---
function unsubscribeFromPushNotification() {
  navigator.serviceWorker.ready.then(function (registration) {
    registration.pushManager
      .getSubscription()
      .then(function (subscription) {
        subscription
          .unsubscribe()
          .then(function () {
            console.log("Push notification unsubscribed.");
            pushElement.dataset.checked = false;
            return messaging.getToken();
          })
          .then((token) => {
            console.log(token);
            removeSubscriptionIDFromServer(token);
          })
          .catch(function (error) {
            console.error(error);
          });
      })
      .catch(function (error) {
        console.error("Failed to unsubscribe push " + "notification.");
      });
  });
}

//---get references to the UI elements---
let pushElement = document.querySelector(".checkbox");

//---event handler for the push button---
pushElement.addEventListener("click", function () {
  //---check if you are already subscribed to push notifications---
  if (pushElement.dataset.checked === "true") {
    unsubscribeFromPushNotification();
  } else {
    subscribeToPushNotification();
  }
});
