function calc_driving_emissions(distance,fuel_type){
	var dist = distance/1000;
	var kmpg = (35*1.609344);
	var gallons_used = (dist)/(kmpg);
	var liters_used = 4.5461*gallons_used
	var co2_per_liters = 2.20904+0.59852;
	var emissions = (liters_used)*(co2_per_liters);
	return emissions;
}
	

	

	
function display_route(from_id, to_id,wp_id,fuel_type){
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
	  
	  var directionsData0 = response.routes[0]; // Get data about the mapped route
	  
        if (!directionsData0) {
          window.alert('Directions request failed, transit fail');
          return;
        }
	
        else {
          document.getElementById("first_travel_dist").innerHTML = directionsData0.legs[0].distance.text + " (" + directionsData0.legs[0].duration.text + ")";
		  document.getElementById("second_travel_dist").innerHTML = directionsData0.legs[1].distance.text + " (" + directionsData0.legs[1].duration.text + ")";
		  let total_dist = (directionsData0.legs[0].distance.value) + (directionsData0.legs[1].distance.value);
		  let total_time = (directionsData0.legs[0].duration.value) + (directionsData0.legs[1].duration.value);
		  let total_hours = Math.floor(total_time/3600);
		  let total_mins = Math.floor((total_time%3600)/60);
		  
		  document.getElementById("total_dist").innerHTML = total_dist/1000 +" km"+ " (" + total_hours + " hours "+ total_mins+" mins).";
		  document.getElementById("est_co2_emm").innerHTML = calc_driving_emissions(total_dist,fuel_type);
		  
		}
	  }        
      });	
}

	
function autocomplete_inputs(){

		autocomplete_from = new google.maps.places.Autocomplete(document.getElementById("from"))
		autocomplete_to = new google.maps.places.Autocomplete(document.getElementById("to"))
		autocomplete_wp = new google.maps.places.Autocomplete(document.getElementById("wp"))
		
		traveler_num = document.getElementById("traveler_num");
		mpg_of_car = document.getElementById("car_mpg");
		crsid = document.getElementById("crsid");
		date = document.getElementById("date");
		role = document.getElementById("role");
		fuel_type = document.getElementById("fuel_type");
				
		// Add listeners
		autocomplete_from.addListener('place_changed', route_changed);
		autocomplete_to.addListener('place_changed', route_changed);
		autocomplete_wp.addListener('place_changed',route_changed);
		
		
		traveler_num.addEventListener('change', route_changed);		
		traveler_num.addEventListener('change', meta_info_changed);
		crsid.addEventListener('change',meta_info_changed);
		date.addEventListener('change', meta_info_changed);
		role.addEventListener('change', meta_info_changed);
		fuel_type.addEventListener('change', meta_info_changed);

		}
		
		function route_changed(){
			
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

		

		
		
		display_route(from_id, to_id,wp_id,document.getElementById("fuel_type").innerHTML);

		}}}				
}	
		function meta_info_changed(){
			
		document.getElementById("inputted_date").innerHTML = document.getElementById("date").value;
		document.getElementById("inputted_crsid").innerHTML = document.getElementById("crsid").value;
		document.getElementById("inputted_traveler_num").innerHTML = document.getElementById("traveler_num").value;
		document.getElementById("inputted_role").innerHTML = document.getElementById("role").value;
		document.getElementById("inputted_fuel").innerHTML = document.getElementById("fuel_type").value;

		
}
		
function initMap(){
autocomplete_inputs();
}
  
 
	
