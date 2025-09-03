import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

export type Coords = { latitude: number; longitude: number };

type Props = { coords?: Coords | null };

const defaultRegion: Region = {
  latitude: 46.603354,
  longitude: 1.888334,
  latitudeDelta: 5,
  longitudeDelta: 5,
};

export default function MapPreview({ coords }: Props) {
  const region: Region = coords
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
        {coords && <Marker coordinate={coords} title="Position de la photo" />}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});