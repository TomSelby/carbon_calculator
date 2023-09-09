import { getDatabase, ref, set ,onValue, remove} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth,GoogleAuthProvider,signInWithPopup,signOut} from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js';

  const firebaseConfig = {
  apiKey: "AIzaSyBmsFgDym6LSrqb_KeoH46qmefiDqxgqQ8",
  authDomain: "stranks-emissions-calc.firebaseapp.com",
  databaseURL:"https://stranks-emissions-calc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "stranks-emissions-calc",
  storageBucket: "stranks-emissions-calc.appspot.com",
  messagingSenderId: "1011068278586",
  appId: "1:1011068278586:web:6751acc06c83fa37012203",
  measurementId: "G-1NL7TYWEFZ"
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

var login_btn = document.getElementById('login');
login_btn.addEventListener('click', signin);

var sign_out_btn = document.getElementById("logout");
sign_out_btn.addEventListener('click',sign_out);

function delete_entry(row_id){
	console.log(row_id);
	// The signed-in user info.
	const auth = getAuth();
	if (auth.currentUser == null){
		alert('Please sign in to submit data');	
	};
	const userId = auth.currentUser.uid;
	
	remove(ref(db,'users/' +userId+'/'+String(row_id)));
	

}

	
function renderTable(arr,data){
	// Create anchor element
	var table = document.getElementById("tbody");
	while(table.hasChildNodes()){
    table.removeChild(table.firstChild);
    }
    var j = 0;
	arr.forEach(function (row){
		let timestamp = row;
		let date = data[row]['date'];
		let origin = data[row]['origin'];
		let destination = data[row]['destination'];
		let method = data[row]['method'];
		let distance = data[row]['distance'];
		let return_journey = data[row]['return_journey'];
		let co2eq = data[row]['total_co2'];
		
		// Create row
		var tr = document.createElement('TR');
		table.appendChild(tr);
		
		let entry = [timestamp, date, origin, destination, method, distance, return_journey, co2eq]
		
		for (var i=0; i < 8; i++){
			
			var td = document.createElement('TD');
			td.width = '100';
			td.appendChild(document.createTextNode(entry[i]));
			tr.appendChild(td);
		};
		
		// 1. Create the button
		var del_btn = document.createElement("button");
		del_btn.innerHTML = "Delete";
		del_btn.id = j; // set the button id as the row it's in

		// 2. Append somewhere
		var del_btn_table = document.createElement('delete_btn');
		del_btn_table.appendChild(del_btn);

		// Finally append del btn
		tr.appendChild(del_btn);
		// 3. Add event handler
		
		del_btn.addEventListener("click", function(){
		delete_entry(table.rows[del_btn.id].cells[0].textContent);//pass the entry id (using button id (row)) into the delete entry func
		});
		j++;// increment button id/row counter
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


	
	
	
	