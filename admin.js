// IMPORTANT: REPLACE THE FOLLOWING CONFIGURATION WITH YOUR OWN FIREBASE PROJECT CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyBgIg7tbnGtSoeo0nHMn6IkeuvMp30ar9w",
  authDomain: "esrat-4e28f.firebaseapp.com",
  databaseURL: "https://esrat-4e28f-default-rtdb.firebaseio.com",
  projectId: "esrat-4e28f",
  storageBucket: "esrat-4e28f.appspot.com",
  messagingSenderId: "712315598095",
  appId: "1:712315598095:android:ed0f042ee1d5410dfb7a7a"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    const flashlightRef = database.ref('flashlight_command/state');

    const onButton = document.getElementById('on-button');
    const offButton = document.getElementById('off-button');
    const statusElement = document.getElementById('status');
    const controlsDiv = document.getElementById('controls');

    // Update UI to show connection is ready
    statusElement.textContent = "Admin panel ready. Click a button to send a command.";
    controlsDiv.classList.remove('hidden');

    // Function to send command
    function sendCommand(state) {
        flashlightRef.set(state)
            .then(() => {
                statusElement.textContent = `Command sent: Flashlight ${state ? 'ON' : 'OFF'}.`;
                console.log("Command successfully written to Firebase.");
            })
            .catch((error) => {
                statusElement.textContent = `Error sending command: ${error.message}`;
                console.error("Error writing to Firebase: ", error);
            });
    }

    // Event listeners for buttons
    onButton.addEventListener('click', () => sendCommand(true));
    offButton.addEventListener('click', () => sendCommand(false));

    // Optional: Listen for the current state in the database and update the status
    flashlightRef.on('value', (snapshot) => {
        const state = snapshot.val();
        if (state !== null) {
            statusElement.textContent = `Current state in Firebase: Flashlight ${state ? 'ON' : 'OFF'}.`;
        }
    });

} catch (error) {
    document.getElementById('status').textContent = `Firebase Initialization Error: ${error.message}. Please check your firebaseConfig in admin.js.`;
    console.error("Firebase Initialization Error: ", error);
}
