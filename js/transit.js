function calc_transit_emissions(route){
	total_emissions = 0
	for (let i =0; i < route.length; i++){
		var travel_method = route[i]['instructions'].charAt(0);
		var distance = route[i]['distance'].value/1000;
	
		if (travel_method == 'B'){
			total_emissions =total_emissions + 0.0965*distance
			console.log('Bus');
			
		}else if (travel_method == 'T'){
			total_emissions =total_emissions + 0.03549*distance

			console.log('Train');
			
		}else if (travel_method == 'U'){
			total_emissions =total_emissions + 0.02781*distance
			console.log('Underground');
		}
		else if (travel_method == 'F'){
			total_emissions = total_emissions + 0.11286*distance
			console.log('Ferry')
		}
				
				
		
	}
	document.getElementById("est_co2_emm").innerHTML = Math.round(total_emissions);
	

};
	
function display_route(from_id, to_id){
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
        travelMode: 'TRANSIT'		
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
		route = directionsData0['legs']['0']['steps'];
		console.log(route);
        document.getElementById("total_dist").innerHTML = directionsData0.legs[0].distance.value/1000 + ' km'; // can also have .duration
		let travel_dist = (directionsData0.legs[0].distance.value)
		calc_transit_emissions(route);
		  
		}
	  }        
      });	
}

	
function autocomplete_inputs(){
		
		autocomplete_from = new google.maps.places.Autocomplete(document.getElementById("from"));
		autocomplete_to = new google.maps.places.Autocomplete(document.getElementById("to"));
		
		date = document.getElementById("date");
		role = document.getElementById("role");
		description = document.getElementById("description");
		// Add listeners
		autocomplete_from.addListener('place_changed', route_changed);
		autocomplete_to.addListener('place_changed', route_changed);
		
	
		
		date.addEventListener('change', meta_info_changed);
		role.addEventListener('change', meta_info_changed);
		description.addEventListener('change', meta_info_changed);
		}
		
function route_changed(){
			
		var from_place = autocomplete_from.getPlace();
		var to_place = autocomplete_to.getPlace();
		
		
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

		

		
		
		display_route(from_id, to_id);

		}}}				
	
function meta_info_changed(){
			
		document.getElementById("inputted_date").innerHTML = document.getElementById("date").value;
		document.getElementById("inputted_role").innerHTML = document.getElementById("role").value;
		document.getElementById("inputted_description").innerHTML = document.getElementById("description").value;
		calc_transit_emissions(route);
}
		
function initMap(){


autocomplete_inputs();

}
  
 
	
