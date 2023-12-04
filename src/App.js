import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import classNames from 'classnames';

// mapbox-gl@2.4.0
mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZXNtdXJkemEiLCJhIjoiY2xsaGdtbTRhMTkwYTNlbGdia2p1aDh0YyJ9.IZzOCXEURRfJbO8ZiYhfSg';

const locations = [
  { lng: -122.4194, lat: 37.7749 }, // San Francisco
  { lng: -122.4061, lat: 37.7880 }, // Union Square
  { lng: -122.4313, lat: 37.7694 }, // Golden Gate Park
  { lng: -122.4443, lat: 37.7360 }, // Lake Merced
];
const zoom = 11;

function Map({ locations, zoom, onMarkerClick }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [clickedMarker, setClickedMarker] = useState(null);

  useEffect(() => {
    if (map.current) return; // Initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Change map color to dark mode
      center: [-122.4194, 37.7749], // San Francisco
      zoom: zoom
    });

    // Add markers to the map
    locations.forEach((location, index) => {
      const marker = new mapboxgl.Marker({ color: '#311' })
        .setLngLat([location.lng, location.lat])
        .addTo(map.current);
      marker.getElement().addEventListener('click', () => {
        setClickedMarker(index);
        onMarkerClick(index);
      });
    });
  });

  useEffect(() => {
    if (clickedMarker === null) return;
    const popup = new mapboxgl.Popup()
      .setHTML(`Clicked marker no. ${clickedMarker + 1}`);
    const { lng, lat } = locations[clickedMarker];
    new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map.current);
  }, [clickedMarker, locations]);

  return (
    <>
      <div ref={mapContainer} className="map-container" style={{ height: '400px' }} />
      <div id="info" className="bg-white px-4 py-2 mt-2" style={{ display: clickedMarker === null ? 'none' : 'block' }}>
        <p>
          You clicked on marker no. {clickedMarker + 1}.
        </p>
      </div>
    </>
  );
}

function Heading() {
  return (
    <div className={classNames("p-2", "text-center", "py-8")}>
      <h1 className="text-3xl font-extralight tracking-tight lg:text-4xl text-white">
        SF Hacker Houses
      </h1>
    </div>
  );
}

export default function App() {
  const handleMarkerClick = (index) => {
    console.log(`Clicked marker no. ${index + 1}`);
  }

  return (
    <div className="bg-[#1f1f1f] h-screen w-screen">
      <Heading />
      <Map locations={locations} zoom={zoom} onMarkerClick={handleMarkerClick} />
    </div>
  );
}