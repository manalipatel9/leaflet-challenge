// url for the json file
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl).then((data) => {
    createMap(data.features);
});

function createMap(features) {

  //function to determine the color of the points 
    function getColor(alt) {
        if (alt < 10) return "green"; 
        else if (alt < 30) return "lightgreen"; 
        else if (alt < 50) return "yellow"; 
        else if (alt < 70) return "orange"; 
        else if (alt < 90) return "red"; 
        else return "darkred"; 
    }
    //function for geting the points
    function pointCircle(point, latLng) {
        return L.circle([latLng["lat"], latLng["lng"]], {
            fillOpacity: 0.75,
            color: "black",
            fillColor: getColor(latLng["alt"]),
            radius: point.properties.mag * 10000,
        });
    }

    function addInfo(feature, layer) {
        layer.bindPopup(`<p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p><p>Location: ${feature.properties.place}</p>`)
    }

    let earthquakes = L.geoJSON(features, {
        pointToLayer: pointCircle,
        onEachFeature: addInfo
    });
    
    // Creates the layer that will be the background of our map.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Creates a map object.
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    function getHexColor(depth) {
        if (depth < 10) return "#90EE90";
        else if (depth < 30) return "#008000";
        else if (depth < 50) return "#FFFF00";
        else if (depth < 70) return "#FFA500";
        else if (depth < 90) return "#FF0000";
        else return "#8B0000";
    }

    // Creates a legend.
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let intervals = [-10, 10, 30, 50, 70, 90];

    for (var i = 0; i < intervals.length; i++) {
        div.innerHTML +=
            "<li style=\"background-color: " + getHexColor(intervals[i]) + "\">" + intervals[i] + (intervals[i + 1] ? ' &ndash; ' + intervals[i + 1] + '<br>' : '+')
             + "</li>";
    }

    return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);
    
}