import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
// import L from "leaflet";

window.type = "";

const Map = () => {
  const [features, setFeatures] = useState([]);
  const [searchText, setSearchText] = useState("");
  const featureGroupRef = useRef(null);

  const handleCreated = (e) => {
    const layer = e.layer;
    const newFeature = {
      layer,
      text: "Components",
    };
    setFeatures((features) => [...features, newFeature]);
  };

  const handleDeleted = useCallback(
    (e) => {
      const layers = e.layers;
      const layerIds = Object.keys(layers._layers);
      const remainingFeatures = features.filter((feature) => !layerIds.includes(feature.layer._leaflet_id.toString()));
      setFeatures(remainingFeatures);
    },
    [features]
  );

  const handleEdited = (e) => {
    const layers = e.layers;
    layers.eachLayer((layer) => {
      const updatedFeatures = features.map((feature) => {
        if (feature.layer._leaflet_id === layer._leaflet_id) {
          return {
            ...feature,
            layer: layer,
          };
        }
        return feature;
      });
      setFeatures(updatedFeatures);
    });
  };

  const handleTextChange = (index, text) => {
    const updatedFeatures = [...features];
    updatedFeatures[index].text = text;
    setFeatures(updatedFeatures);
  };

  const searchFeatures = () => {
    const lowerSearchText = searchText.toLowerCase();
    featureGroupRef.current.clearLayers();
    features.forEach((feature) => {
      const lowerFeatureText = feature.text.toLowerCase();
      if (lowerFeatureText.includes(lowerSearchText)) {
        featureGroupRef.current.addLayer(feature.layer);
      }
    });
  };

  useEffect(() => {
    console.log(features);
  }, [features]);

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 relative h-full">
        <div className="absolute top-0 left-0 right-0 bottom-0">
          <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FeatureGroup ref={featureGroupRef}>
              <EditControl
                position="bottomleft"
                onCreated={handleCreated}
                onDeleted={handleDeleted}
                onEdited={handleEdited}
                draw={{
                  polyline: true,
                  polygon: true,
                  circle: true,
                  rectangle: true,
                  marker: true,
                }}
              />
            </FeatureGroup>
          </MapContainer>
        </div>
      </div>
      <div className="w-[320px] p-4">
        <div className="w-full space-x-2">
          <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search text" className="border p-2" />
          <button className="bg-green-600 text-white px-4 py-2" onClick={searchFeatures}>
            Search
          </button>
        </div>
        <div className="space-y-2 py-2">
          {features.map((feature, index) => (
            <div key={index} className="space-y-2">
              <div>
                <label>Text for feature {index + 1}:</label>
              </div>
              <div className="">
                <textarea value={feature.text} onChange={(e) => handleTextChange(index, e.target.value)} rows={3} className="border p-2 w-full"></textarea>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Map;
