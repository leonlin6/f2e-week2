import React from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {

    // var greenIcon = L.icon({
    //     iconUrl: {require('../images/SelectMark.png').default},
    
    //     iconSize:     [38, 95], // size of the icon
    //     shadowSize:   [50, 64], // size of the shadow
    //     iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    //     shadowAnchor: [4, 62],  // the same for the shadow
    //     popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    // });

    // L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map).bindPopup("I am a green leaf.");

    const getMaker = () => {
        return L.icon(
            {
                iconUrl: require('../images/SelectMark.png').default,
                iconSize: '14px'

            }
        )
    }

    return (
        <div className="map" id="map">
        <MapContainer center={[25.0408578889, 121.567904444]} zoom={13} scrollWheelZoom={false} accessToken={`pk.eyJ1IjoibGVvbmxpbjYiLCJhIjoiY2t3OWw4NXM3MWxvcTJ0cDh1aW5vanMxcyJ9.0jqwkVr2aXtuA3hfUKxUbA`}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[25.0408578889, 121.567904444]} icon={getMaker()}>
                <Popup>
               腳踏車租借處。
                </Popup>
            </Marker>
        </MapContainer>
        </div>
    )
}

export default Map;