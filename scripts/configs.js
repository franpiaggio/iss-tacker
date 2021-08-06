const urls = {
    iss: "https://api.wheretheiss.at/v1/satellites/25544",
    mapbox: "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    osm: (lat, long) => `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&zoom=18&addressdetails=1`  
}
const tilesConfig =  {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: import.meta.env.VITE_APP_MAPBOX
}

export {urls, tilesConfig}