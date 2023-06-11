import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCd7nuCEuD7ySAQN8bNxZqpYLUrSQUbpcg",
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
const alldataRef = ref(db, '/');

function renderChart(series,div,title){
   JSC.Chart(div, {
	title_label_text: title,
    legend_visible: true,	
	xAxis_crosshair_enabled: true,
    series: series
   });
};
function renderbar(data,div,title){
	JSC.Chart(div, {
   title_label_text: title,
   type: 'horizontal column',
   legend_visible: false,	
   xAxis_crosshair_enabled: true,
   series: [
      {
         points: [
            {x: 'PIs', y: data[0]},
            {x: 'Post-Docs', y: data[1]},
			{x: 'Students',y: data[2]}
         ]
      }
   ]
});
}; 
   
 





onValue(alldataRef, (snapshot) => {
  const data = snapshot.val();
const arr = Object.keys(data);
  let emissions_over_time = [], distance_over_time = [];
  let total_distance = 0;
  let total_emissions = 0;
  let PI_total = 0;
  let post_doc_total = 0;
  let student_total = 0;
  
  arr.forEach(function (row) {
	 console.log(data[row]);
	 total_emissions = total_emissions + Number(data[row]['total_co2']);
	 total_distance = total_distance+ Number(data[row]['distance']);
	 
	 emissions_over_time.push({y:total_emissions});
	 distance_over_time.push({y:total_distance});// can add x here if you want
	 if (data[row]['role'] === 'PI'){ 
		PI_total = PI_total + Number(data[row]['total_co2']);
		
	 }else if (data[row]['role'] === 'Post-Doc'){
		post_doc_total = post_doc_total + Number(data[row]['total_co2']);
	 }else if(data[row]['role'] === 'PhD' || data[row]['role'] === 'Masters'|| data[row]['role'] === 'Undergraduate'){
	 student_total = student_total +Number(data[row]['total_co2'])
	 }
  });
  
  
  renderChart([{name:'emissions',points: emissions_over_time}],'emissions_chartDiv','Total Emissions Reported');
  renderChart([{name:'distance',points: distance_over_time}],'distance_chartDiv', 'Total Distance Reported');
  renderbar([PI_total,post_doc_total,student_total],'donut_chartDiv','Emissions by Group');




});





	
	
	