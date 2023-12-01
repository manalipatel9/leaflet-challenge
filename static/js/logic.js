let Center_Coords = [37.757807,-122.5200013]; 
let map_zoom_level = 9;
let my_map;


function createMap(Earthquake_Data) {

let background_map = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let Base = {
  "Street Map": background_map
};

let overlay = {
  "Earthquakes": Earthquake_Data
};

my_map = L.map("map", {
    center: Center_Coords,
    zoom: map_zoom_level,
    layers: [background_map, Earthquake_Data]
})

L.control.layers(Base, overlay).addTo(my_map);
createLegend();
}

function createLegend() {
    let legend = L.control({
      position: "bottomright"
    });

    legend.onAdd = function () {
      let div = L.DomUtil.create("div", "legend");
      div.innerHTML = [
        "<h3>Legend" + "</h3>",
        "<table>",
        "<th>" + "Color" + "</th>",
        "<th>" + "Depth (km)" + "</th>",
        "<tr>",
        "<td class='greaterthan90'>" + "</td>",
        "<td style='text-align: center;'>" +"> 90" + "</td>",
        "</tr>",
        "<tr>",
        "<td class='greaterthan70'>" + "</td>",
        "<td style='text-align: center;'>" +"70 - 90" + "</td>",
        "</tr>",
        "<tr>",
        "<td class='greaterthan50'>" + "</td>",
        "<td style='text-align: center;'>" +"50 - 70" + "</td>",
        "</tr>",
        "<tr>",
        "<td class='greaterthan30'>" + "</td>",
        "<td style='text-align: center;'>" +"30 - 50" + "</td>",
        "</tr>",
        "<tr>",
        "<td class='greaterthan10'>" + "</td>",
        "<td style='text-align: center;'>" +"10 - 30" + "</td>",
        "</tr>",
        "<tr>",
        "<td class='lessthan10'>" + "</td>",
        "<td style='text-align: center;'>" +"< 10" + "</td>",
        "</tr>",
        "</table>"
      ].join("");
      return div;
    };

    legend.addTo(my_map);
  }  

function createMarkers(response) {
let All_EarthquakeMarkers = [];
  for (let i = 0; i < response.features.length; i++) {
    let earthquake = response.features[i];
    let longitude = earthquake.geometry.coordinates[0];
    let latitude = earthquake.geometry.coordinates[1];
    let depth = earthquake.geometry.coordinates[2];
    let magnitude = earthquake.properties.mag;
    let place = earthquake.properties.place;
    let url = earthquake.properties.url;
    let timestamp = earthquake.properties.time;
    let date = new Date(timestamp);
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    let day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours() + 5).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let formattedDateTime = `${month}/${day}/${year} ${hours}:${minutes}`;
    let color = "";
    if (depth > 90) {
      color = "rgb(153,0,0)";
        }
    else if (depth > 70) {
      color = "rgb(255,0,0)";
        }
    else if (depth > 50) {
      color = "rgb(204,102,0)";
        }
    else if (depth > 30) {
      color = "rgb(255,153,51)";
          }
    else if (depth > 10) {
      color = "rgb(255,255,0)";
          }
    else {
      color = "rgb(0,255,0)";
        }

    let EarthquakeMarker = L.circle([latitude, longitude], {
        fillOpacity: 0.6,
        color: 'black',
        weight: 1,
        fillColor: color,
        radius: magnitude * 3000
    }).bindPopup(
    "<b>Date/Time: </b>" + formattedDateTime + " (UTC)"
    + "<br>" +
    "<b>Magnitude: </b>" + magnitude + " md"
    + "<br>" +
    "<b>Depth: </b>" + depth + " km"
    + "<br>" +
    "<b>Place: </b>" + place
    + "<br>" +
    "<b>Latitude: </b>" + latitude
    + "<br>" +
    "<b>Longitude: </b>" + longitude
    + "<br>" +
    "<a href=" + url + " target=_blank>" + "More Details" + "</a>"
    );

    All_EarthquakeMarkers.push(EarthquakeMarker);
  }

  createMap(L.layerGroup(All_EarthquakeMarkers));
}

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(url).then(createMarkers);