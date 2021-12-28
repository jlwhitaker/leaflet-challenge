var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


function getColor(x){
    return x <10 ? '#DAF7A6':
           x <30 ? '#FFC300':
           x <50 ? '#FF5733':
           x <70 ? '#C70039':
           x <90 ? '#900C3F':
                       '#581845';

}


function markerSize(mag) {
    return mag * 20000;
  }

d3.json(queryUrl, function (data) {

    createFeatures(data.features);
});


  
function createFeatures(earthquakeData) {
  
   

    var earthquakes = L.geoJSON(earthquakeData, {
onEachFeature: function(feature,layer){
            

    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);    
            },

        pointToLayer: function (feature, latlng) {
            return new L.circle(latlng, {
            
                radius: markerSize(feature.properties.mag), 
            
                fillColor: getColor(feature.geometry.coordinates[2]), 
                color: "#000",
                weight: 0.5,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
    }
);
    
    
    

    createMap(earthquakes);
}


function createMap(earthquakes) {


    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });


  

    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo,
    };
  

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    
    var myMap = L.map("map", {
        center: [
            59.0397,158.4575
            ],
        zoom: 5,
        layers: [street, earthquakes]
    });


    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);


    var legend = L.control({position: 'bottomright'});


    legend.onAdd = function (myMap) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            depth = [0, 10, 30, 50, 70, 90],
            labels = [],
            from, to;
    

        for (var i = 0; i < depth.length; i++) {
            from = depth[i];
            to = [from + 20];

            labels.push(
                '<i style="background:' + getColor(from + 1) + ';color:' + getColor(from + 1) +';">sometexttogivespace</i> ' +
                from + (from ? '&ndash;' + to : ''));
            }
            div.innerHTML = labels.join('<br>');
            return div;
        };
    

    
    
    
    legend.addTo(myMap);
    
} 
