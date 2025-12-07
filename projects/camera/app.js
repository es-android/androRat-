// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBgIg7tbnGtSoeo0nHMn6IkeuvMp30ar9w",
  authDomain: "esrat-4e28f.firebaseapp.com",
  databaseURL: "https://esrat-4e28f-default-rtdb.firebaseio.com",
  projectId: "esrat-4e28f",
  storageBucket: "esrat-4e28f.appspot.com",
  messagingSenderId: "712315598095",
  appId: "1:712315598095:android:ed0f042ee1d5410dfb7a7a"
};

// INITIALIZE
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const db = firebase.database();

// ELEMENTS
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("captureBtn");
const ctx = canvas.getContext("2d");

// START CAMERA
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => alert("Camera error: " + err));

// CAPTURE CLICK
captureBtn.addEventListener("click", () => {
  
  // DRAW IMAGE TO CANVAS
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // CONVERT CANVAS TO BLOB
  canvas.toBlob(blob => {
    if (!blob) {
      alert("Capture failed: Blob is null");
      return;
    }

    const timestamp = Date.now();
    const filename = `capture_${timestamp}.png`;

    // UPLOAD TO STORAGE
    const storageRef = storage.ref("captures/" + filename);
    const uploadTask = storageRef.put(blob);

    uploadTask.on(
      "state_changed",
      null,
      err => alert("Upload error: " + err),
      () => {
        // GET DOWNLOAD URL
        uploadTask.snapshot.ref.getDownloadURL().then(url => {
          
          // SAVE TO REALTIME DATABASE
          db.ref("captures/" + timestamp).set({
            url: url,
            filename: filename,
            timestamp: timestamp
          });

          alert("Uploaded successfully!");
        });
      }
    );

  }, "image/png");
});
