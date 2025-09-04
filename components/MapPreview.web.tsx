import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { StyleSheet, View } from "react-native";

export type Coords = { latitude: number; longitude: number };
type Props = { coords?: Coords | null };

const defaultCenter: [number, number] = [46.603354, 1.888334]; // France

export default function MapPreview({ coords }: Props) {
  const mapRef = useRef<any>(null);

  const center: [number, number] = coords
    ? [coords.latitude, coords.longitude]
    : defaultCenter;

  useEffect(() => {
    if (mapRef.current) {
      // Forcer Leaflet à recalculer la taille du container
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100);
    }
  }, [coords]);

  return (
    <View style={styles.container}>
      <MapContainer
        center={center}
        zoom={coords ? 13 : 6}
        style={styles.map}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coords && (
          <Marker position={center}>
            <Popup>Position de la photo</Popup>
          </Marker>
        )}
      </MapContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%", // ✅ obligatoire pour Leaflet
    height: "100%", // ✅ obligatoire pour Leaflet
  },
});
