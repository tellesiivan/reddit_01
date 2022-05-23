import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const createUserDoc = functions.auth.user().onCreate(async (user) => {
  const newUser = {
    uid: user.uid,
    email: user.email,
    providerData: user.providerData,
    displayName: user.displayName,
  };

  db.collection("users").doc(user.uid).set(newUser);
});
