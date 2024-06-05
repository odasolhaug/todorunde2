// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdpRecXPljSht-xjP2Wt08hGXTz41OdUw",
  authDomain: "todo-liste-83a5a.firebaseapp.com",
  projectId: "todo-liste-83a5a",
  storageBucket: "todo-liste-83a5a.appspot.com",
  messagingSenderId: "1036382041793",
  appId: "1:1036382041793:web:7b3c38376444c766eb4640"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

import {
  getFirestore,
  collection,
  doc,
  query,
  where,
  getDoc,
  getDocs,
  deleteDoc,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

const db = getFirestore(app)
const docRef = doc(db, "todoItems", "1");
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
}

const listeRef = document.getElementById("liste")

//const q = query(collection(db, "todoItems"), where("erFerdig", "==", false));
//const querySnapshot = await getDocs(q);
const querySnapshot = await getDocs(collection(db, "todoItems"));
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
  const item = document.createElement("li")
  item.innerHTML = doc.data().tekst
  item.dataset.id = doc.id
  if (doc.data().erFerdig) {
    item.classList.add("ferdig")
  }
  listeRef.appendChild(item)
  item.addEventListener("click", klikk)
});

async function klikk(event) {
  console.log("klikk")
  console.log(event.target)
  //fjerne objektet fra lista vår lokalt: 
  listeRef.removeChild(event.target)
  //fjern objektet fra Google Firestore 
  const id = event.target.dataset.id
  await deleteDoc(doc(db, "todoItems", id));
}

document.getElementById("knapp").addEventListener("click", leggTilOppgave)

async function leggTilOppgave() {
  const oppgaveTekst = document.getElementById("oppgave").value
  console.log(oppgaveTekst)

  // Add a new document with a generated id.
  const docRef = await addDoc(collection(db, "todoItems"), {
    tekst: oppgaveTekst,
    erFerdig: false,
  }); 
  console.log("Document written with ID: ", docRef.id);

  const item = document.createElement("li")
  item.innerHTML = oppgaveTekst
  item.dataset.id = docRef.id
  listeRef.appendChild(item)
  item.addEventListener("click", klikk)

}