var API_KEY = "pk.eyJ1IjoiYXJ0cGVya2l0bnkiLCJhIjoiY2pvbHhicWppMDd6ODNyczgwajgxOTh1eiJ9.Tp-0nrsAJdOY0SPSfyuzqg";


console.log('dis');
var map = L.map("map-id", {
  center: [40.7128, -74.0059],
  zoom: 11
});

// Adding tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(map);


d3.json("../data/station_info.json", function(error, response) {

  // Pull the "stations" property off of response.data
  var stations = response;

  // Initialize an array to hold bike markers
  var bikeMarkers = [];

  // Loop through the stations array
  for (var index = 0; index < stations.length; index++) {
    var station = stations[index];

    // For each station, create a marker and bind a popup with the station's name
    L.marker([station.latitude, station.longitude])
      .bindPopup("<h3>" + station.address + "</h3>").addTo(map);

    // Add the marker to the bikeMarkers array
    //bikeMarkers.push(bikeMarker);

   };

 });
