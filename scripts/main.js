import '../public/style.css'
import L from 'leaflet'
import {urls, tilesConfig} from './configs'
import icon from '../public/img/icon.png'

// DOM Elements
const $vel = document.getElementById("velocity")
const $alt = document.getElementById("altitude")
const $vis = document.getElementById("visibility")
const $country = document.getElementById("country")
let geo;
const mymap = L.map('map').setView([-34.6083, -58.37723], 13)
let currCountry;
L.tileLayer(urls.mapbox, tilesConfig).addTo(mymap)
// Init marker
const milaicon = L.icon({
  iconUrl: icon,
  shadowUrl: icon,
  iconSize:     [60, 60],
  shadowSize:   [60, 60],
  iconAnchor:   [0, 0],
  shadowAnchor: [0, 0],
  popupAnchor:  [0, 0]
});
const marker = L.marker([-34.6083, -58.37723], {icon: milaicon}).addTo(mymap)
// Creo el layer para ir agregando/quitando paises
let layerGroup = new L.LayerGroup()
layerGroup.addTo(mymap)
let layer = L.geoJSON()
async function getGeoJson(){
  try{
    console.log("run")
    const resGeo = await fetch('https://franciscopiaggio.com/iss/countriesgeo.json')
    const data = await resGeo.json()
    geo = data
    getISS()
    setInterval(getISS, 3000)
  }catch(e){
    console.log(e)
  }
}
async function getISS(){
  try{
    mymap.invalidateSize();
    // Obtengo la pos de ISS
    const res = await fetch(urls.iss)
    const data = await res.json()
    const resOsm = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.latitude}&lon=${data.longitude}&zoom=18&addressdetails=1&polygon_geojson=1&accept-language=en`)
    // https://nominatim.org/release-docs/develop/api/Reverse/
    const dataOsm = await resOsm.json()
    const countryCode = dataOsm.error ? null : dataOsm.address.country
    if(currCountry !== countryCode){
      const countryToPaint = geo.features.find(current => current.properties?.ADMIN === countryCode)
      //const countryToPaint = dataOsm.geojson
      if(countryToPaint){
        $country.innerText = countryToPaint.properties?.ADMIN
        // Borrado de layer
        layerGroup.removeLayer(layer)
        // Pintado del nuevo pais
        layer = L.geoJSON(countryToPaint)
        // Agregamos el nuevo pais
        layerGroup.addLayer(layer)
      }
    }else{
      layerGroup.removeLayer(layer)
      $country.innerText = "Water"
    }
    if(dataOsm.error){
      layerGroup.removeLayer(layer)
      $country.innerText = "Water"
    }
    // Actualizo la view
    mymap.setView([data.latitude, data.longitude], mymap.getZoom())
    $vel.innerText = data.velocity.toFixed(2) + "km/h"
    $alt.innerText = parseInt(data.altitude) + "km"
    $vis.innerText = data.visibility === "daylight" ? "Day" : "Night"
    mymap.setView([data.latitude, data.longitude])
    marker.setLatLng([data.latitude, data.longitude])
  }catch(err) {
    console.log(err)
  }
}
getGeoJson()
