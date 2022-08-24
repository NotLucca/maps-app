import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import "@reach/combobox/styles.css";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
} from "@reach/combobox";
import mapStyles from "./mapStyles";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import Complaints from "./components/Complaints";
import stopsData from './csvjson.json'
import Stops from "./components/Stops";
const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
};

export default function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [stopData, setStopData] = useState([])
  


  const getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          lat: latitude,
          lng: longitude,
        });
      });
    }
  };
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  
  
    useEffect(() => {
      getGeoLocation();
      setStopData([stopsData])
    }, []);
  const onMapClick = useCallback((event) => {
    setMarkers((current) => [
      ...current,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);
  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  const loadData = (data) => {
    const jsonData = data

    return jsonData
  }

  const busData = useMemo(() => loadData(stopsData), [])

  if (loadError) return "error loading maps";
  if (!isLoaded) return "loading maps";

  return (
    <div className="app">
      <Stops data={busData}></Stops>
      <Search panTo={panTo} />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={18}
        center={userLocation ? userLocation : { lat: -34.397, lng: 150.644 }}
        options={options}
        onClick={(event) => {
          onMapClick(event);
        }}
        onLoad={onMapLoad}
      >
        {
          busData.map(stop => <Marker
            icon={{
              url: "https://img.icons8.com/color/48/000000/bus.png",
              scaledSize: new window.google.maps.Size(30, 30),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
            }} 
            position={{lat: stop.stop_lat, lng: stop.stop_lon}}
            key={Math.random()}
          >
          </Marker>)
        }
        {markers.map((marker) => (
          <Marker
            key={marker ? marker.time.toISOString() : Math.random()}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={{
              url: "https://img.icons8.com/color/48/000000/marker.png",
              scaledSize: new window.google.maps.Size(30, 30),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
            }}
            onClick={() => {
              setSelected(marker);
            }}
          />
        ))}
        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            
            <Complaints />
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}

function Search(props) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => -34.397, lng: () => 150.644 },
      radius: 200 * 1000,
    },
  });

  return (
    <>
      <div className="map-controllers">
        <span>
          <span
            role="img"
            aria-label="emoji"
            style={{
              fontSize: "2.5rem",
            }}
          >
            🗺️
          </span>
        </span>
        <Combobox
          onSelect={async (address) => {
            setValue(address, false);
            clearSuggestions();
            try {
              const results = await getGeocode({ address });
              const { lat, lng } = await getLatLng(results[0]);
              props.panTo({ lat, lng });
            } catch (err) {
              console.log(err);
            }
          }}
          className="form-control"
        >
          <ComboboxInput
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            disable={!ready}
            placeholder="Enter an adress"
            key={Math.random()}
          />
          <ComboboxPopover>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption
                  key={id + Math.random()}
                  value={description}
                  style={{
                    fontSize: "1.5rem",
                    listStyle: "none",
                  }}
                />
              ))}
          </ComboboxPopover>
        </Combobox>
      </div>
    </>
  );
}
