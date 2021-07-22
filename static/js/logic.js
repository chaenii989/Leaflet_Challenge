
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicplatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Create layerGroups
var earthquakes = L.layerGroup();
var tectonicplates = L.layerGroup();

// Define 3 tileLayers
var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", 
{
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox.satellite",
    accessToken: API_KEY
});

var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", 
{
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", 
{
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
});

 // Define a baseMaps object to hold our base layers
 var baseMaps = {
    "Satellite": satelliteMap,
    "Grayscale": grayscaleMap,
    "Outdoors": outdoorsMap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Tectonic Plates": tectonicplates,
    "Earthquakes": earthquakes
  };

  
  var myMap = L.map("map", {
    center: [40.76, -10.89],
    zoom: 3,
    layers: [satelliteMap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);

//Get earthquake data from earthquake url
d3.json(earthquakeURL).then(function(data){
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng,{
            color: 'black',
            radius: feature.properties.mag * 3,
            fillColor : getColor(latlng.alt),
            fillOpacity : 0.85,
            stroke: true,
            weight: 1.0
        }).bindPopup(function (data) {
            return `Location:${feature.properties.place}<br>Magnitude: ${feature.properties.mag}`;
        })
    }}).addTo(myMap);
});


// Create getColor function
function getColor(depth) {
    switch (true) {
        case depth>90:
            return 'red';
        case depth>70:
            return 'orange';
        case depth>50:
            return 'yellow';
        case depth>30:
            return 'lightyellow';
        case depth>10:
            return 'lightgreen';
        case depth<11:
            return 'green';
    }
}

 // Get the tectonic plate data from tectonicplatesURL
 d3.json(tectonicplatesURL).then(function(data) {
    L.geoJSON(data, {
      color: "orange",
      weight: 2
    }).addTo(myMap);
  });


// Create legend
var legend = L.control({
    position: "bottomright"
});

legend.onAdd = function(myMap){
    var div = L.DomUtil.create("div", "info legend"),
    grades = [-10,10,30,50,70,90],
    labels = [];

    for (var i=0; i<grades.length; i++){
        div.innerHTML +=
        '<i style="background:' + getColor(grades[i]+1) +'"></i> ' + grades[i] + (grades[i+1] ? '&ndash;' + grades[i+1] + '<br>': '+');
    }
    return div;
};
legend.addTo(myMap);
