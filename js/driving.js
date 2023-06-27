function calc_driving_emissions(distance,fuel_type,car_size,return_j){
fetch("./driving_calibrations.json")
.then(response => {
   return response.json();
})
.then(data => {
	var emissions = data[fuel_type.value][car_size.value]*distance;
	console.log(return_j);
	if (return_j == true){
		emissions = emissions*2;
		
	}
	console.log("Estimated_emissions")
	console.log(emissions);
	document.getElementById("est_co2_emm").innerHTML = Math.round(emissions);
	
})}
	


	
function display_route(from_id, to_id,wp_id){
	
	console.log('Display route called')
	// Map set-up
	const center = {lat:52.1951, lng:0.1313};
	const options = {zoom:7, scaleControl:true, center:center};
	map = new google.maps.Map(document.getElementById("map"), options);
	let directionsService = new google.maps.DirectionsService();
	let directionsRenderer = new google.maps.DirectionsRenderer();
	directionsRenderer.setMap(map); // Existing map object displays directions


	//Display route
	directionsService.route({
		origin: { placeId: from_id},
        destination: { placeId: to_id},
        travelMode: "DRIVING",
		waypoints: [{
        location: {placeId: wp_id},
        stopover: true}],
		optimizeWaypoints: false		
	}, function(response, status) { // anonymous function to capture directions
      if (status !== 'OK') {
        window.alert('Directions request failed due to ' + status);
        return;
      } else {
      directionsRenderer.setDirections(response); // Add route to the map
	  
	  var directionsData0 =  response.routes[0]; // Get data about the mapped route
	  
        if (!directionsData0) {
          window.alert('Directions request failed, transit fail');
          return;
        }
	
        else {
		// Display the legs

        document.getElementById("first_travel_dist").innerHTML = directionsData0.legs[0].distance.text + " (" + directionsData0.legs[0].duration.text + ")";
		document.getElementById("second_travel_dist").innerHTML = directionsData0.legs[1].distance.text + " (" + directionsData0.legs[1].duration.text + ")";
		// Display the totals

		var total_distance = directionsData0.legs[0].distance.value + directionsData0.legs[1].distance.value;
		let total_time = directionsData0.legs[0].duration.value + directionsData0.legs[1].duration.value;
		let total_hours = Math.floor(total_time/3600);
		let total_mins = Math.floor((total_time%3600)/60);
		
		document.getElementById("total_dist").innerHTML = total_distance/1000;
		

		calc_driving_emissions(total_distance/1000,document.getElementById("fuel_type"),document.getElementById("car_size"))
		}
	  }        
      });	
}

	
function autocomplete_inputs(){

		autocomplete_from = new google.maps.places.Autocomplete(document.getElementById("from"))
		autocomplete_to = new google.maps.places.Autocomplete(document.getElementById("to"))
		autocomplete_wp = new google.maps.places.Autocomplete(document.getElementById("wp"))
		
		traveler_num = document.getElementById("traveler_num");
		crsid = document.getElementById("crsid");
		date = document.getElementById("date");
		role = document.getElementById("role");
		fuel_type = document.getElementById("fuel_type");
		car_size = document.getElementById("car_size");
		return_j = document.getElementById("return_j");
				
		// Add listeners
		autocomplete_from.addListener('place_changed', route_changed);
		autocomplete_to.addListener('place_changed', route_changed);
		autocomplete_wp.addListener('place_changed',route_changed);
		
		
		traveler_num.addEventListener('change', meta_info_changed);
		crsid.addEventListener('change',meta_info_changed);
		date.addEventListener('change', meta_info_changed);
		role.addEventListener('change', meta_info_changed);
		fuel_type.addEventListener('change', meta_info_changed);
		car_size.addEventListener('change', meta_info_changed);
		return_j.addEventListener('change', meta_info_changed);
		}
		
async function route_changed(){
		console.log("Route changed called");
		var from_place = autocomplete_from.getPlace();
		var to_place = autocomplete_to.getPlace();
		var wp_place = autocomplete_wp.getPlace();
		
		if (!wp_place.geometry){
		document.getElementById('wp').placeholder = 'Waypoint';
		} else {
		wp_id = wp_place.place_id;

		if (!from_place.geometry){
		// User did not select a valid place; reset the input feild
		document.getElementById('from').placeholder = 'Origin';

		} else {
		//Display place details
		from_id = from_place.place_id;
		document.getElementById("inputted_origin").innerHTML = from_place.name;

		
		if (!to_place.geometry){
		// User did not select a valid place; reset the input feild
		document.getElementById('to').placeholder = 'Destination';
		} else {
		//Display place details
		to_id = to_place.place_id;
		document.getElementById("inputted_destination").innerHTML = to_place.name;

		
		
		display_route(from_id, to_id,wp_id);
		
		
		// calcualte emissions
		//calc_driving_emissions(total_dist,fuel_type,car_size);
		
		
		}}}				
}	
		function meta_info_changed(){
			
		document.getElementById("inputted_date").innerHTML = document.getElementById("date").value;
		document.getElementById("inputted_crsid").innerHTML = document.getElementById("crsid").value;
		document.getElementById("inputted_traveler_num").innerHTML = document.getElementById("traveler_num").value;
		document.getElementById("inputted_role").innerHTML = document.getElementById("role").value;
		document.getElementById("inputted_fuel").innerHTML = document.getElementById("fuel_type").value;
		document.getElementById("inputted_size").innerHTML = ["Small", "Medium", "Large", "Average"][document.getElementById("car_size").value];
		document.getElementById("inputted_return").innerHTML = document.getElementById("return_j").checked;
		
		
		calc_driving_emissions(document.getElementById("total_dist").innerHTML,document.getElementById("fuel_type"),document.getElementById("car_size"),document.getElementById("return_j").checked)

		
		
}

function initMap(){
autocomplete_inputs();
}
