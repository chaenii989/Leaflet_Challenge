// Create map
var myMap = L.map("map", {
    center: [40.76, -10.89],
    zoom: 2
    });

L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    }
).addTo(myMap);

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var myStyle = 

d3.json(link).then(function(data){
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng,{
            color: 'black',
            radius: feature.properties.mag * 2,
            fillColor : getColor(latlng.alt),
            fillOpacity : 0.85,
            weight: 1.0
        }).bindPopup(function (data) {
            return `${feature.properties.place}<br>Magnitude: ${feature.properties.mag}`;
        })
    }}).addTo(myMap);
});

function getColor(depth) {
    switch (true) {
        case depth>90:
            return 'red';
    
        case depth>60:
            return 'yellow';
    
        case depth<61:
            return 'green';
    }
}
        