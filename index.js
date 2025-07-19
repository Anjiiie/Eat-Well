import {
  getFirestore,
  collection,
  setDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { app } from "./FIREBASECONFIG.js";

const auth = getAuth(app);
const db = getFirestore(app);
const usersCollection = collection(db, "users");

const signUpBtn = document.getElementById("sign-up-btn");
const signupFormEl = document.getElementById("order-now-form");
const orderEmail = document.getElementById("order-email");
const orderUsername = document.getElementById("order-username");
const orderPassword = document.getElementById("order-password");
const errorMessageEl = document.getElementById("errorMessage");

const signUp = async () => {
  const email = orderEmail?.value.trim();
  const username = orderUsername?.value.trim();
  const password = orderPassword?.value.trim();

  if (!email || !username || !password) {
    errorMessageEl.textContent = "All fields are required.";
    errorMessageEl.style.color = "red";
    resetBtn();
    return;
  }

  if (password.length < 6) {
    errorMessageEl.textContent = "Password must be at least 6 characters.";
    errorMessageEl.style.color = "red";
    resetBtn();
    return;
  }

  try {
    signUpBtn.textContent = "Creating Account...";
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const newUser = {
      id: user.uid,
      email: email,
      username: username
    };

    await setDoc(doc(usersCollection, user.uid), newUser);

    window.location.href = "../EATWELLMENU/eatwellmenu.html";
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      errorMessageEl.textContent = "Email already in use.";
    } else {
      errorMessageEl.textContent = error.message || "Signup failed.";
    }
    errorMessageEl.style.color = "red";
  } finally {
    resetBtn();
  }
};

function resetBtn() {
  signUpBtn.textContent = "Sign Up";
  signUpBtn.disabled = false;
}

if (signupFormEl) {
  signupFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    signUpBtn.textContent = "Signing Up...";
    signUpBtn.disabled = true;
    errorMessageEl.textContent = "";
    signUp();
  });
}

const signInEmailEl = document.getElementById("signin-email")
const signInPasswordEl = document.getElementById("signin-password")
const signInFormEl = document.getElementById("custom-signin-form")
const signInErrorMsgEl = document.getElementById("signInErrorMsg")
const signInBtn = document.getElementById("sign-in-btn")
const signIn = async () => {
  const email = signInEmailEl.value.trim();
  const password = signInPasswordEl.value.trim();

  if (!email || !password) {
    signInErrorMsgEl.textContent = "Email and password are required";
   signInErrorMsgEl.style.color = "red";
    return;
  }

  try {
    signInBtn.textContent = "Signing In...";
    signInBtn.disabled = true;

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
      window.location.href = "../EATWELLMENU/eatwellmenu.html";
    }
  } catch (error) {
    console.error("Signin error:", error);
   if (error.code === "auth/invalid-credential") {
       signInErrorMsgEl.textContent = "No account found with this email.";
   }  else if (error.code === "auth/wrong-password") {
 signInErrorMsgEl.textContent = "Incorrect password.";
  }  else {
    signInErrorMsgEl.textContent = "Signin failed. Please try again.";
  }
    signInErrorMsgEl.style.color = "red";
  } finally {
    signInBtn.textContent = "Sign In";
    signInBtn.disabled = false;
  }
};
signInFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  signIn();
});



