import { getDatabase, ref, set ,onValue} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth,GoogleAuthProvider,signInWithPopup,signOut} from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyD05bky4dBxfyQlRaFVRrW-jAqs-x9gp9k",
    authDomain: "co2-calc-367923.firebaseapp.com",
    databaseURL: "https://co2-calc-367923-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "co2-calc-367923",
    storageBucket: "co2-calc-367923.appspot.com",
    messagingSenderId: "102663905016",
    appId: "1:102663905016:web:80ecdf2ec7115f42d8a50d",
    measurementId: "G-KSH5ELJK7N"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

console.log('Firebase initialized');
document.getElementById("signed_in_user").innerHTML = sessionStorage.getItem("CRSid");

function signin(){
signInWithPopup(auth, provider)
.then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result['user'];	// IdP data available using getAdditionalUserInfo(result)
	console.log(user);
	const crsid = user['email'].split('@')[0]; // defined as a global variable
	sessionStorage.setItem("CRSid", crsid);
	const email_domain = user['email'].split('@')[1];
	
	if (email_domain != 'cam.ac.uk'){// Make sure cam user
	signOut(auth).then(() => {
	sessionStorage.removeItem("CRSid");

	alert("Please sign in with CRSid");
	location.reload()
	}).catch((error) => {
	// An error happened.
	});
	} else {
	console.log('Cam user signed in')
	document.getElementById("signed_in_user").innerHTML = crsid;

	}
	
	}).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
	console.log(errorMessage);
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
	});
};


function sign_out(){
	signOut(auth).then(() => {
	sessionStorage.removeItem("CRSid");

	alert("Signed out");
	location.reload()
});
};

function InsertData(){
	// The signed-in user info.
	const auth = getAuth();
	if (auth.currentUser == null){
		alert('Please sign in to submit data');
		
	};
	const userId = auth.currentUser.uid;	
	set(ref(db,'users/' +userId+'/'+String((Date.now()))), {
	crsid: document.getElementById("signed_in_user").innerHTML,
    manual_input: 'false',
	method: 'air',
    date: document.getElementById("date").value,
	role: document.getElementById("role").value,
	origin: document.getElementById('from').value,
	destination: document.getElementById('to').value,
	distance: document.getElementById("distance").value,
	total_co2: document.getElementById("emmissions").value
	})
	.then(()=>{
	alert("Thank you, your data has been sucesfully sorted, if you made a mistake in your submission please contact tas72");
	location.reload()
	})
	.catch((error)=>{
	alert(error)
	});
};


var login_btn = document.getElementById('login');
login_btn.addEventListener('click', signin);

var sign_out_btn = document.getElementById("logout");
sign_out_btn.addEventListener('click',sign_out);

var send_btn = document.getElementById("send");
send_btn.addEventListener('click', InsertData);

	

	
	
	
	