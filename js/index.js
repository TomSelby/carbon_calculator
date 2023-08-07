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

var login_btn = document.getElementById('login');
login_btn.addEventListener('click', signin);

var sign_out_btn = document.getElementById("logout");
sign_out_btn.addEventListener('click',sign_out);



	
function renderTable(arr,data){
	// Create anchor element
	
				
				
				
				
				
	var table = document.getElementById("tbody");
	while(table.hasChildNodes()){
    table.removeChild(table.firstChild);
    }
    
	arr.forEach(function (row){
		let timestamp = row;
		let date = data[row]['date'];
		let origin = data[row]['origin'];
		let destination = data[row]['destination'];
		let method = data[row]['method'];
		let distance = data[row]['distance'];
		let return_journey = data[row]['return_journey'];
		let co2eq = data[row]['total_co2'];
		
		
		var tr = document.createElement('TR');
		table.appendChild(tr);
				
		
		
		let entry = [timestamp, date, origin, destination, method, distance, return_journey, co2eq]
		
		for (var i=0; i < 8; i++){
			
			var td = document.createElement('TD');
			td.width = '100';
			td.appendChild(document.createTextNode(entry[i]));
			tr.appendChild(td);
		};
	

	});
};

function renderChart(series,div,title,ylabel){
   JSC.Chart(div, {
	title_label_text: title,
    legend_visible: true,	
	xAxis_crosshair_enabled: true,
	xAxis:{label_text: 'Submission Number'},
	yAxis:{label_text:ylabel},
    series: series
   });
};


function update_charts(){	
if (auth.currentUser == null){
		alert('Please sign in to display data');
		
	};
const userId = auth.currentUser.uid;

const alldataRef = ref(db, '/users/'+userId+'/');
onValue(alldataRef, (snapshot) => {
const data = snapshot.val();

const arr = Object.keys(data);

let emissions_over_time = [], distance_over_time = [];
let total_distance = 0;
let total_emissions = 0;

arr.forEach(function (row) {
	
	total_emissions = total_emissions + Number(data[row]['total_co2']);
	total_distance = total_distance+ Number(data[row]['distance']);
	 
	 emissions_over_time.push({y:total_emissions});
	 distance_over_time.push({y:total_distance});// can add x here if you want
	 
});
  
  
 
renderChart([{name:'emissions',points: emissions_over_time}],'emissions_chartDiv','Total Emissions Reported','kg of CO'+'2'.sub()+'eq');
renderChart([{name:'distance',points: distance_over_time}],'distance_chartDiv', 'Total Distance Reported', 'Distance Traveled (km)');
renderTable(arr,data);
});	
};



var update_charts_btn = document.getElementById("update_charts");
update_charts_btn.addEventListener('click', update_charts);


	
	
	
	