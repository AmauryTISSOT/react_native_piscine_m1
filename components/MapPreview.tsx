import { Platform, StyleSheet, View } from "react-native";
import type { Region } from "react-native-maps";

/** --- Carte native pour iOS/Android --- */
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export type Coords = { latitude: number; longitude: number };

type Props = {
  coords?: Coords | null;
};

const defaultRegion: Region = {
  latitude: 46.603354,
  longitude: 1.888334,
  latitudeDelta: 5,
  longitudeDelta: 5,
};

export default function MapPreview({ coords }: Props) {
  if (Platform.OS === "web") {
    return <WebMap coords={coords} />;
  }
  return <NativeMap coords={coords} />;
}

function NativeMap({ coords }: Props) {
  const region = coords
    ? { ...coords, latitudeDelta: 0.02, longitudeDelta: 0.02 }
    : defaultRegion;

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        region={region}
      >
        {coords && (
          <Marker coordinate={coords} title="Position de la photo" />
        )}
      </MapView>
    </View>
  );
}

/** --- Carte web avec Leaflet --- */
function WebMap({ coords }: Props) {
  const { MapContainer, TileLayer, Marker, Popup } = require("react-leaflet");
  const position = coords
    ? [coords.latitude, coords.longitude]
    : [defaultRegion.latitude, defaultRegion.longitude];

  return (
    <View style={styles.container}>
      <MapContainer
        center={position}
        zoom={coords ? 13 : 6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coords && (
          <Marker position={position}>
            <Popup>Position de la photo</Popup>
          </Marker>
        )}
      </MapContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
