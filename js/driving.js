function calc_driving_emissions(distance,fuel_type,car_size){
	
fetch("./driving_calibrations.json")
.then(response => {
   return response.json();
})
.then(data => {
	console.log(data);
	console.log(distance)
	var emissions = data[fuel_type.value][car_size.value]*distance;
	


	console.log("Estimated_emissions")
	console.log(emissions);
	document.getElementById("est_co2_emm").innerHTML = Math.round(emissions);
	
})}
var wp_dict = {};
function addWaypointfeild(){
	current_waypoint_ids = get_correct_waypoints();
	
	if (current_waypoint_ids.length === 0){
	var newWaypoint_id = 'wp1';} else {
	var newWaypoint_id = 'wp'+current_waypoint_ids.at(-1).slice(2)+1;
	}
	var newWaypoint = document.createElement('div');
	newWaypoint.setAttribute("class", "column");
	newWaypoint.innerHTML = "<input type='text' id="+newWaypoint_id+" size='50' placeholder='Waypoint'/> <button class='btn' onclick='removeWaypointfeild(this.parentNode)'>-</button>";
	document.getElementById('inRows').appendChild(newWaypoint);
	
	
	
	var autocomplete_wp = new google.maps.places.Autocomplete(document.getElementById(newWaypoint_id));
	autocomplete_wp.addListener('place_changed',route_changed);
	wp_dict[newWaypoint_id] = autocomplete_wp;
}

function removeWaypointfeild(node){
	try{
	return node.remove();} finally {
	route_changed();
	}
}
	
function get_correct_waypoints(){
	number_of_waypoints = document.getElementById('inRows').getElementsByClassName('column').length
	waypoint_id_arr = [];
	for(let i = 1; i<number_of_waypoints; i++){
		wp_id = document.getElementById('inRows').getElementsByClassName('column')[i].firstChild.id;
		waypoint_id_arr.push(wp_id);
	}
	return waypoint_id_arr;
}






function display_route(from_id, to_id,wp_ids){
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
		waypoints: wp_ids,
		optimizeWaypoints: false		
	}, function(response, status) { // anonymous function to capture directions
      if (status !== 'OK') {
        window.alert('Directions request failed due to ' + status);
        return;
      } else {
      directionsRenderer.setDirections(response); // Add route to the map
	  console.log('displayed')
	  var directionsData0 =  response.routes[0]; // Get data about the mapped route
	  
        if (!directionsData0) {
          window.alert('Directions request failed, transit fail');
          return;
        }
	
        else {

		// Display the totals
		console.log(directionsData0.legs.length);
		total_distance = 0;
		for (let i = 0; i<directionsData0.legs.length;i++){
			console.log(directionsData0.legs[i].distance.value)
			total_distance += directionsData0.legs[i].distance.value;
		}
	
		
		document.getElementById("total_dist").innerHTML = total_distance/1000 + ' km';
		

		calc_driving_emissions(total_distance/1000,document.getElementById("fuel_type"),document.getElementById("car_size"));
		}
	  }        
      });	
}





function autocomplete_inputs(){
		
		autocomplete_from = new google.maps.places.Autocomplete(document.getElementById("from"));
		autocomplete_to = new google.maps.places.Autocomplete(document.getElementById("to"));
		
		traveler_num = document.getElementById("traveler_num");
		date = document.getElementById("date");
		role = document.getElementById("role");
		fuel_type = document.getElementById("fuel_type");
		car_size = document.getElementById("car_size");
		return_j = document.getElementById("return_j");
				
		// Add listeners
		autocomplete_from.addListener('place_changed', route_changed);
		autocomplete_to.addListener('place_changed', route_changed);
		
		
		traveler_num.addEventListener('change', meta_info_changed);
		date.addEventListener('change', meta_info_changed);
		role.addEventListener('change', meta_info_changed);
		fuel_type.addEventListener('change', meta_info_changed);
		car_size.addEventListener('change', meta_info_changed);
		return_j.addEventListener('change', meta_info_changed);
		}
		
function route_changed(){
		
		var correct_wps = get_correct_waypoints();
		
		wp_ids = [];
		
		for (i=0;i<correct_wps.length;i++){
		
		wp_ids.push({
        location: {placeId: wp_dict[correct_wps[i]].getPlace().place_id},
        stopover: true});}
		
		
		var from_place = autocomplete_from.getPlace();
		var to_place = autocomplete_to.getPlace();
		from_id = from_place.place_id;
		document.getElementById("inputted_origin").innerHTML = from_place.name;
		to_id = to_place.place_id;
		document.getElementById("inputted_destination").innerHTML = to_place.name;
		display_route(from_id, to_id,wp_ids);
		
		
				
}	
function meta_info_changed(){
			
		document.getElementById("inputted_date").innerHTML = document.getElementById("date").value;
		document.getElementById("inputted_traveler_num").innerHTML = document.getElementById("traveler_num").value;
		document.getElementById("inputted_role").innerHTML = document.getElementById("role").value;
		document.getElementById("inputted_fuel").innerHTML = document.getElementById("fuel_type").value;
		document.getElementById("inputted_size").innerHTML = ["Small", "Medium", "Large", "Average"][document.getElementById("car_size").value];

		calc_driving_emissions(total_distance/1000,document.getElementById("fuel_type"),document.getElementById("car_size"));
		
		
}

function initMap(){
autocomplete_inputs();
}
