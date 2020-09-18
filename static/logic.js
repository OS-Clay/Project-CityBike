var API_KEY = "pk.eyJ1IjoiYXJ0cGVya2l0bnkiLCJhIjoiY2pvbHhicWppMDd6ODNyczgwajgxOTh1eiJ9.Tp-0nrsAJdOY0SPSfyuzqg";

// Perform a data call to the Citi bike data to get station information. Call createMarkers when complete (this is a pretend file, need real file)
// d3.csv("Data/citibike.csv", createMarkers);


// function createMap(bikeStations) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
  accessToken: API_KEY
}).addTo(myMap);

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Bike Stations": bikeStations
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [40.73, -74.0059],
    zoom: 12,
    layers: [lightmap, bikeStations]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

function createMarkers(response) {
  // d3.csv("final_pop.csv")
  // Pull the "stations" property off of response.data
  var stations = response.data.stations;

  // // Initialize an array to hold bike markers
  var bikeMarkers = [];

  // Loop through the stations array
  for (var index = 0; index < response.length; index++) {
    var station = response[index];

    // For each station, create a marker and bind a popup with the station's name
    var bikeMarker = L.marker([station["start station latitude"], station["start station longitude"]])
      .bindPopup("<h3>" + station["start station name"] + "<h3><h3>Capacity: "  + " " + "</h3>");

    // Add the marker to the bikeMarkers array
    bikeMarkers.push(bikeMarker);
  }
  // console.log(bikeMarkers);
  //
  // Create a layer group made from the bike markers array, pass it into the createMap function
  createMap(L.layerGroup(bikeMarkers));
}

  // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
  d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json", createMarkers);
