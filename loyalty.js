// ✅ Use Firebase v8 compat (for script-based usage)
const firebaseConfig = {
  apiKey: "AIzaSyBwvnVw0IeBkVl_08ZoIjNMW_JPKFuNrS0",
  authDomain: "mycampus-1489b.firebaseapp.com",
  projectId: "mycampus-1489b",
  storageBucket: "mycampus-1489b.appspot.com",
  messagingSenderId: "427991580336",
  appId: "1:427991580336:web:3686653d01d53f5481c575",
  measurementId: "G-4WP2ZYF7EP"
};

// 🔧 Init
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 🔐 Login/Signup
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password).catch(err => alert(err.message));
}

function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, password).catch(err => alert(err.message));
}

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(err => alert(err.message));
}

function logout() {
  auth.signOut();
}

// 🧠 Handle Auth State
auth.onAuthStateChanged(user => {
  const loginSec = document.getElementById("login-section");
  const userSec = document.getElementById("user-section");
  const userEmail = document.getElementById("user-email");
  const msg = document.getElementById("claim-message");

  if (user) {
    loginSec.style.display = "none";
    userSec.style.display = "block";
    userEmail.innerText = `Logged in as: ${user.email}`;
    msg.innerText = "";
  } else {
    loginSec.style.display = "block";
    userSec.style.display = "none";
    msg.innerText = "";
  }
});

// 🏅 Claim Point Logic
function claimPoint() {
  const user = auth.currentUser;
  if (!user) return;

  const docRef = db.collection("loyalty").doc(user.uid);

  docRef.get().then(doc => {
    const today = new Date().toDateString();
    const lastClaimed = doc.exists ? doc.data().lastClaimed : null;

    if (lastClaimed === today) {
      document.getElementById("claim-message").innerText = "⚠️ You've already claimed today!";
    } else {
      docRef.set({
        lastClaimed: today,
        points: firebase.firestore.FieldValue.increment(1)
      }, { merge: true }).then(() => {
        docRef.get().then(updatedDoc => {
          const points = updatedDoc.data().points || 0;
          document.getElementById("claim-message").innerText = `✅ Point claimed! You now have ${points} point${points === 1 ? '' : 's'}.`;
        });
      });
    }
  });
}
